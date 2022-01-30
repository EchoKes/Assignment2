package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type Comment struct {
	Id                int    `json:"id"`
	CommentDesc       string `json:"comment"`
	CommentorId       string `json:"commentorId"`
	CommentorType     string `json:"commentorType"`
	ReceiverId        string `json:"receiverId"`
	ReceiverType      string `json:"receiverType"`
	PublishedDatetime string `json:"datetime"`
	Anonymous         bool   `json:"anonymous"`
}

var db *sql.DB

func landing(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "~ Ratings & Comments Dashboard ~")
}

// Retrieve all comments, Post a comment on student, Update a comment given to a student
func allComments(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	studentId := params["studentid"]
	// {Part 1: Retrieve all comments}
	if r.Method == "GET" {
		showIdValue := r.URL.Query().Get("showid")
		showid := false
		correctIdValue := true
		switch showIdValue {
		case "0":
			break
		case "1":
			showid = true
		default:
			correctIdValue = false
		}
		if correctIdValue {
			comments := DB_retrieveAllComments(studentId, showid)
			json.NewEncoder(w).Encode(comments)
			w.WriteHeader(http.StatusAccepted)
			// w.Write([]byte("202 - All comments retrieved"))
		} else {
			w.WriteHeader(http.StatusNotAcceptable)
			w.Write([]byte("No url query or incorrect id value in url query. Please use 1 for true, 0 for false."))
		}
	}

	if r.Header.Get("Content-type") == "application/json" {
		var comment Comment
		regBody, err := ioutil.ReadAll(r.Body)
		if err == nil {
			json.Unmarshal(regBody, &comment)
		} else {
			w.WriteHeader(http.StatusUnprocessableEntity)
			w.Write([]byte("422 - Please enter account details in JSON format"))
		}

		// {Part 2: Comment on a student}
		if r.Method == "POST" {
			// Create tutor's comment for student
			if DB_insertComment(comment) {
				w.WriteHeader(http.StatusCreated)
				w.Write([]byte("201 - Comment created"))
			} else {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte("400 - Unable to create comment"))
			}

		}
		// {Part 3: Update comment on a student}
		if r.Method == "PUT" {
			// Update tutor's comment for student
			if DB_updateComment(comment) {
				w.WriteHeader(http.StatusAccepted)
				w.Write([]byte("202 - Comment updated"))
			} else {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte("400 - Unable to update comment"))
			}

		}
	}
}

// Get all comments received
func commentsReceived(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		params := mux.Vars(r)
		tutorId := params["tutorid"]
		comments := DB_retrieveReceivedComments(tutorId)
		json.NewEncoder(w).Encode(comments)
		w.WriteHeader(http.StatusAccepted)
		// w.Write([]byte("202 - All received comments retrieved"))
	}
}

// Get all anonymized comments
func anonComments(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		params := mux.Vars(r)
		tutorId := params["tutorid"]
		comments := DB_retrieveAnonComments(tutorId)
		json.NewEncoder(w).Encode(comments)
		w.WriteHeader(http.StatusAccepted)
		// w.Write([]byte("202 - All anonymous comments retrieved"))
	}
}

// View all given comments
func givenComments(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		params := mux.Vars(r)
		tutorId := params["tutorid"]
		comments := DB_retrieveGivenComments(tutorId)
		json.NewEncoder(w).Encode(comments)
		w.WriteHeader(http.StatusAccepted)
		// w.Write([]byte("202 - All given comments retrieved"))
	}
}

func commentsFromTutor(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		params := mux.Vars(r)
		tutorId := params["tutorid"]
		studentId := params["studentid"]
		commentDetails := DB_retrieveCommentsFromTutor(tutorId, studentId)
		json.NewEncoder(w).Encode(commentDetails)
		w.WriteHeader(http.StatusAccepted)
		// w.Write([]byte("202 - Tutor details received"))
	}
}

// DB function for retrieving all comments of student made by tutors
// returns an array of type Comment of all comments
func DB_retrieveAllComments(receiverId string, showid bool) []Comment {
	var commentArray []Comment

	query := fmt.Sprintf(`
	SELECT * FROM Comments WHERE receiverId = '%s'
	ORDER BY datetime desc;`, receiverId)
	res, err := db.Query(query)

	if err != nil {
		panic(err.Error())
	}

	for res.Next() {
		var c Comment
		res.Scan(&c.Id, &c.CommentDesc, &c.CommentorId, &c.CommentorType, &c.ReceiverId, &c.ReceiverType, &c.PublishedDatetime, &c.Anonymous)

		if !showid {
			if c.Anonymous {
				c.CommentorId = ""
			}
		}

		commentArray = append(commentArray, c)
	}

	return commentArray
}

// DB function for tutor comment a student, AKA creation of comment
// returns true if insert is successful
func DB_insertComment(comment Comment) bool {
	query := fmt.Sprintf(
		`INSERT INTO Comments(comment, commentorId, commentorType, receiverId, receiverType, datetime, anonymous)
		 VALUES('%s', '%s', 'tutor', '%s', 'student', NOW(), %t);`,
		comment.CommentDesc, comment.CommentorId, comment.ReceiverId, comment.Anonymous)
	res, err := db.Exec(query)

	if err != nil {
		panic(err.Error())
	}

	rows, _ := res.RowsAffected()
	return rows == 1
}

// DB function for updating tutor's comment on a student, AKA update comment
// returns true if update is successful
func DB_updateComment(comment Comment) bool {
	query := fmt.Sprintf(
		`UPDATE Comments SET comment = '%s', datetime = NOW(), anonymous = %t WHERE id = '%d';`,
		comment.CommentDesc, comment.Anonymous, comment.Id)
	res, err := db.Exec(query)

	if err != nil {
		panic(err.Error())
	}

	rows, _ := res.RowsAffected()
	return rows == 1
}

// DB function for retrieving all received comments of tutor
// returns an array of type Comment of all received comments
func DB_retrieveReceivedComments(tutorId string) []Comment {
	var commentArray []Comment

	query := fmt.Sprintln(`SELECT * FROM Comments WHERE receiverId = '%s';`, tutorId)
	res, err := db.Query(query)

	if err != nil {
		panic(err.Error())
	}

	for res.Next() {
		var c Comment
		res.Scan(&c.Id, &c.CommentDesc, &c.CommentorId, &c.CommentorType, &c.ReceiverId, &c.ReceiverType, &c.PublishedDatetime, &c.Anonymous)
		commentArray = append(commentArray, c)
	}

	return commentArray
}

// DB function for retrieving all anonymous comments of tutor
// returns an array of type Comment of all anonymous comments
func DB_retrieveAnonComments(tutorId string) []Comment {
	var commentArray []Comment

	query := fmt.Sprintf(
		`SELECT * FROM Comments WHERE receiverId = '%s' AND anonymous = true;`, tutorId)
	res, err := db.Query(query)

	if err != nil {
		panic(err.Error())
	}

	for res.Next() {
		var c Comment
		res.Scan(&c.Id, &c.CommentDesc, &c.CommentorId, &c.CommentorType, &c.ReceiverId, &c.ReceiverType, &c.PublishedDatetime, &c.Anonymous)
		commentArray = append(commentArray, c)
	}

	return commentArray
}

// DB function for retrieving all of tutor's given comments
// returns an array of type Comment of all tutor's given comments
func DB_retrieveGivenComments(tutorId string) []Comment {
	var commentArray []Comment

	query := fmt.Sprintf(
		`SELECT * FROM Comments WHERE commentorId = '%s';`, tutorId)
	res, err := db.Query(query)

	if err != nil {
		panic(err.Error())
	}

	for res.Next() {
		var c Comment
		res.Scan(&c.Id, &c.CommentDesc, &c.CommentorId, &c.CommentorType, &c.ReceiverId, &c.ReceiverType, &c.PublishedDatetime, &c.Anonymous)
		commentArray = append(commentArray, c)
	}

	return commentArray
}

// DB function for retrieving comments given to a student by certain tutor
func DB_retrieveCommentsFromTutor(tutorId string, studentId string) []Comment {
	var commentArray []Comment
	var c Comment

	query := fmt.Sprintf(
		`SELECT * FROM Comments WHERE commentorId = '%s' 
		AND receiverId = '%s'`, tutorId, studentId)
	res, err := db.Query(query)

	if err != nil {
		panic(err.Error())
	}

	if res.Next() {
		for res.Next() {
			res.Scan(&c.Id, &c.CommentDesc, &c.CommentorId, &c.CommentorType, &c.ReceiverId, &c.ReceiverType, &c.PublishedDatetime, &c.Anonymous)
			commentArray = append(commentArray, c)
		}
	} else {
		c.CommentDesc = "nil"
		commentArray = append(commentArray, c)
	}

	return commentArray
}

func main() {
	// environment variables
	BASE_STUDENT_API_URL := os.Getenv("BASE_COMMENTS_API_STUDENT_URL")
	BASE_TUTOR_API_URL := os.Getenv("BASE_COMMENTS_API_TUTOR_URL")

	// start router
	router := mux.NewRouter()

	// setup routers
	router.HandleFunc("/landing", landing)
	router.HandleFunc(BASE_STUDENT_API_URL, allComments).Methods("GET", "POST", "PUT")
	router.HandleFunc(BASE_TUTOR_API_URL+"/received", commentsReceived).Methods("GET")
	router.HandleFunc(BASE_TUTOR_API_URL+"/anon", anonComments).Methods("GET")
	router.HandleFunc(BASE_TUTOR_API_URL+"/given", givenComments).Methods("GET")
	router.HandleFunc(BASE_STUDENT_API_URL+"/from/{tutorid}", commentsFromTutor).Methods("GET")

	// establish db connection
	var err error
	//db, err = sql.Open("mysql", "root:password@tcp(db:3318)/comment_db")
	db, err = sql.Open("mysql", "root:password@tcp(db_comment:8184)/comment_db")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	// specify allowed headers, methods, & origins to allow CORS
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"})
	origins := handlers.AllowedOrigins([]string{"*"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	router.HandleFunc("/", landing)

	fmt.Println("listening at port 8182")
	log.Fatal(http.ListenAndServe(":8182", handlers.CORS(headers, origins, methods)(router)))
}
