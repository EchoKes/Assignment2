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
	Id                string `json:"id"`
	CommentDesc       string `json:"comment"`
	CommentorId       string `json:"commentorId"`
	CommentorName     string `json:"commentorName"`
	CommentorType     string `json:"commentorType"`
	ReceiverId        string `json:"receiverId"`
	ReceiverName      string `json:"receiverName"`
	ReceiverType      string `json:"receiverType"`
	PublishedDatetime string `json:"datetime"`
	Anonymous         bool   `json:"anonymous"`
}

type Person struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

var db *sql.DB

const student_url = "http://ms_student:8183/students"
const tutor_url = "http://ms_tutor:8184/tutors"

func landing(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "~ Ratings & Comments Dashboard ~")
}

// Retrieve all comments, Post a comment on student, Update a comment given to a student
func allComments(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	studentId := params["studentid"]
	// {Part 1: Retrieve all comments}
	if r.Method == "GET" {
		comments := DB_retrieveAllComments(studentId)
		json.NewEncoder(w).Encode(comments)
		w.WriteHeader(http.StatusAccepted)
		// w.Write([]byte("202 - All comments retrieved"))
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

func allStudents(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		studentArray := MS_getAllPersons(student_url)
		json.NewEncoder(w).Encode(studentArray)
		w.WriteHeader(http.StatusAccepted)
		// w.Write([]byte("202 - Students details received"))
	}
}

func allTutors(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		tutorArray := MS_getAllPersons(tutor_url)
		json.NewEncoder(w).Encode(tutorArray)
		w.WriteHeader(http.StatusAccepted)
		// w.Write([]byte("202 - Tutor details received"))
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

// Retrieve all tutor details from tutor microservice
func MS_getAllPersons(personUrl string) []Person {
	resp, err := http.Get(personUrl)
	var tutorArray []Person

	if err == nil {
		if resp.StatusCode == http.StatusNotFound {
			fmt.Println("409 - No One Found")
		} else {
			data, _ := ioutil.ReadAll(resp.Body)
			resp.Body.Close()
			json.Unmarshal(data, &tutorArray)
			// fmt.Println("202 - Successfully received people details")
		}
	} else {
		fmt.Printf("The HTTP request failed with error %s\n", err)
	}
	return tutorArray
}

// Helper function for retrieving name from student/tutor array
func Helper_retrieveName(id string, personArray []Person) string {
	name := "undefined"
	for _, person := range personArray {
		if person.Id == id {
			name = person.Name
		}
	}
	return name
}

// DB function for retrieving all comments of student
// returns an array of type Comment of all comments
func DB_retrieveAllComments(receiverId string) []Comment {
	var commentArray []Comment

	query := fmt.Sprintf(`
	SELECT * FROM Comments WHERE receiverId = '%s'
	ORDER BY datetime desc;`, receiverId)
	res, err := db.Query(query)

	if err != nil {
		panic(err.Error())
	}

	studentArray := MS_getAllPersons(student_url)
	tutorArray := MS_getAllPersons(tutor_url)

	for res.Next() {
		var c Comment
		var personArray []Person
		res.Scan(&c.Id, &c.CommentDesc, &c.CommentorId, &c.CommentorType, &c.ReceiverId, &c.ReceiverType, &c.PublishedDatetime, &c.Anonymous)

		switch c.ReceiverType {
		case "Student":
			personArray = studentArray
		case "Tutor":
			personArray = tutorArray
		}
		receiverName := Helper_retrieveName(c.ReceiverId, personArray)
		c.ReceiverName = receiverName

		if c.Anonymous {
			c.CommentorName = "Anonymous"
		} else {
			switch c.CommentorType {
			case "Student":
				personArray = studentArray
			case "Tutor":
				personArray = tutorArray
			}
			commentorName := Helper_retrieveName(c.CommentorId, personArray)
			c.CommentorName = commentorName
		}
		commentArray = append(commentArray, c)
	}

	return commentArray
}

// // DB function for retrieving tutor's comments on a student
// // returns an array of comments.
// func DB_retrieveCommentsFromTeacher() []Comment {
// 	var commentArray []Comment
// 	tutorId := comment.CommentorId
// 	studentId := comment.ReceiverId
// 	commentDesc := "nil"

// 	query := fmt.Sprintf(
// 		`SELECT Comment FROM Comments
// 		 WHERE commentorId = '%s' AND receiverId = '%s';`, tutorId, studentId)
// 	res, err := db.Query(query)

// 	if err != nil {
// 		panic(err.Error())
// 	}

// 	if res.Next() {
// 		res.Scan(&commentDesc)
// 	}

// 	return commentDesc
// }

// DB function for tutor comment a student, AKA creation of comment
// returns true if insert is successful
func DB_insertComment(comment Comment) bool {
	query := fmt.Sprintf(
		`INSERT INTO Comments(comment, commentorId, commentorType, receiverId, receiverType, datetime, anonymous)
		 VALUES('%s', '%s', 'Tutor', '%s', 'Student', NOW(), %t);`,
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
		`UPDATE Comments SET comment = '%s', datetime = NOW(), anonymous = %t WHERE commentorId = '%s' AND receiverId = '%s';`,
		comment.CommentDesc, comment.Anonymous, comment.CommentorId, comment.ReceiverId)
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
	tutorArray := MS_getAllPersons(tutor_url)
	studentArray := MS_getAllPersons(student_url)
	c.CommentorName = Helper_retrieveName(tutorId, tutorArray)
	c.ReceiverName = Helper_retrieveName(studentId, studentArray)

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
	ALLSTUDENTS_API_URL := os.Getenv("ALLSTUDENTS_API_URL")
	ALLTUTORS_API_URL := os.Getenv("ALLTUTORS_API_URL")

	// start router
	router := mux.NewRouter()

	// setup routers
	router.HandleFunc("/landing", landing)
	router.HandleFunc(BASE_STUDENT_API_URL, allComments).Methods("GET", "POST", "PUT")
	router.HandleFunc(BASE_TUTOR_API_URL+"/received", commentsReceived).Methods("GET")
	router.HandleFunc(BASE_TUTOR_API_URL+"/anon", anonComments).Methods("GET")
	router.HandleFunc(BASE_TUTOR_API_URL+"/given", givenComments).Methods("GET")
	router.HandleFunc(ALLSTUDENTS_API_URL, allStudents).Methods("GET")
	router.HandleFunc(ALLTUTORS_API_URL, allTutors).Methods("GET")
	router.HandleFunc(BASE_STUDENT_API_URL+"/from/{tutorid}", commentsFromTutor).Methods("GET")

	// establish db connection
	var err error
	//db, err = sql.Open("mysql", "root:password@tcp(db:3318)/comment_db")
	db, err = sql.Open("mysql", "root:password@tcp(db_comment:8186)/comment_db")
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
