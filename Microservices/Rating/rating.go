package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type Rating struct {
	Id                int    `json:"id"`
	Rating            int    `json:"rating"`
	RaterId           string `json:"raterId"`
	RaterType         string `json:"raterType"`
	ReceiverId        string `json:"receiverId"`
	ReceiverType      string `json:"receiverType"`
	PublishedDatetime string `json:"datetime"`
	Anonymous         bool   `json:"anonymous"`
}

type Student struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

var db *sql.DB

const student_url = "http://localhost:8183/api/v1/students"

func landing(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "~ Ratings & Comments Dashboard ~")
}

// Retrieve all ratings, Post a rating on student, Update a rating given to a student
func allRatings(w http.ResponseWriter, r *http.Request) {
	// {Part 1: Retrieve all ratings}
	if r.Method == "GET" {
		ratings := DB_retrieveAllRatings()
		json.NewEncoder(w).Encode(ratings)
		w.WriteHeader(http.StatusAccepted)
		w.Write([]byte("202 - All ratings retrieved"))
	}
	if r.Header.Get("Content-type") == "application/json" {
		var rating Rating
		regBody, err := ioutil.ReadAll(r.Body)
		if err == nil {
			json.Unmarshal(regBody, &rating)
		} else {
			w.WriteHeader(http.StatusUnprocessableEntity)
			w.Write([]byte("422 - Please enter account details in JSON format"))
		}
		ratingScore := DB_retrieveSingleRating(rating) // TODO: change sql query to exec

		// {Part 2: Rate a student}
		if r.Method == "POST" {
			if ratingScore == -1 {
				// Create tutor's rating for student
				if DB_insertRating(rating) {
					w.WriteHeader(http.StatusCreated)
					w.Write([]byte("201 - Rating created"))
				} else {
					w.WriteHeader(http.StatusBadRequest)
					w.Write([]byte("400 - Unable to create rating"))
				}
			} else {
				w.WriteHeader(http.StatusConflict)
				w.Write([]byte("409 - Rating already made! Try PUT method instead."))
			}
		}
		// {Part 3: Update rating on a student}
		if r.Method == "PUT" {
			if ratingScore != -1 {
				// Update tutor's rating for student
				if DB_updateRating(rating) {
					w.WriteHeader(http.StatusAccepted)
					w.Write([]byte("202 - Rating updated"))
				} else {
					w.WriteHeader(http.StatusBadRequest)
					w.Write([]byte("400 - Unable to update rating"))
				}
			}
		}
	}
}

// Get all ratings received
func ratingsReceived(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		params := mux.Vars(r)
		tutorId := params["tutorid"]
		ratings := DB_retrieveReceivedRatings(tutorId)
		json.NewEncoder(w).Encode(ratings)
		w.WriteHeader(http.StatusAccepted)
		w.Write([]byte("202 - All received ratings retrieved"))
	}
}

// Get all anonymized ratings
func anonRatings(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		params := mux.Vars(r)
		tutorId := params["tutorid"]
		ratings := DB_retrieveAnonRatings(tutorId)
		json.NewEncoder(w).Encode(ratings)
		w.WriteHeader(http.StatusAccepted)
		w.Write([]byte("202 - All anonymous ratings retrieved"))
	}
}

// View all given ratings
func givenRatings(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		params := mux.Vars(r)
		tutorId := params["tutorid"]
		ratings := DB_retrieveGivenRatings(tutorId)
		json.NewEncoder(w).Encode(ratings)
		w.WriteHeader(http.StatusAccepted)
		w.Write([]byte("202 - All given ratings retrieved"))
	}
}

func allStudents(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		studentArray := MS_getAllStudents()
		json.NewEncoder(w).Encode(studentArray)
		w.WriteHeader(http.StatusAccepted)
		w.Write([]byte("202 - Students details received"))
	}
}

// Retrieve all student details from student microservice
func MS_getAllStudents() []Student {
	resp, err := http.Get(student_url)
	var studentArray []Student

	if err == nil {
		if resp.StatusCode == http.StatusNotFound {
			fmt.Println("409 - No Students Found")
		} else {
			data, _ := ioutil.ReadAll(resp.Body)
			resp.Body.Close()
			json.Unmarshal(data, &studentArray)
			fmt.Println("202 - Successfully received students")
		}
	} else {
		fmt.Printf("The HTTP request failed with error %s\n", err)
	}
	return studentArray
}

// DB function for retrieving all ratings of student
// returns an array of type Rating of all ratings
func DB_retrieveAllRatings() []Rating {
	var ratingArray []Rating

	query := "SELECT * FROM Ratings WHERE receiverType = 'Student';"
	res, err := db.Query(query)

	if err != nil {
		panic(err.Error())
	}

	for res.Next() {
		var r Rating
		res.Scan(&r.Id, &r.Rating, &r.RaterId, &r.RaterType, &r.ReceiverId, &r.ReceiverType, &r.PublishedDatetime, &r.Anonymous)
		ratingArray = append(ratingArray, r)
	}

	return ratingArray
}

// DB function for retrieving tutor's rating on a student
// returns an integer value of rating score; -1 for no rating.
func DB_retrieveSingleRating(rating Rating) int {
	tutorId := rating.RaterId
	studentId := rating.ReceiverId
	ratingNum := -1

	query := fmt.Sprintf(
		`SELECT Rating FROM Ratings 
		 WHERE RaterId = '%s' AND ReceiverId = '%s';`, tutorId, studentId)
	res, err := db.Query(query)

	if err != nil {
		panic(err.Error())
	}

	if res.Next() {
		res.Scan(&ratingNum)
	}

	return ratingNum
}

// DB function for tutor rating a student, AKA creation of rating
// returns true if insert is successful
func DB_insertRating(rating Rating) bool {
	query := fmt.Sprintf(
		`INSERT INTO Ratings(rating, raterId, raterType, receiverId, receiverType, datetime, anonymous)
		 VALUES('%d', '%s', 'Tutor', '%s', 'Student', NOW(), %t);`,
		rating.Rating, rating.RaterId, rating.ReceiverId, rating.Anonymous)
	res, err := db.Exec(query)

	if err != nil {
		panic(err.Error())
	}

	rows, _ := res.RowsAffected()
	return rows == 1
}

// DB function for updating tutor's rating on a student, AKA update rating
// returns true if update is successful
func DB_updateRating(rating Rating) bool {
	query := fmt.Sprintf(
		`UPDATE Ratings SET rating = '%d', datetime = NOW() WHERE raterId = '%s' AND receiverId = '%s';`,
		rating.Rating, rating.RaterId, rating.ReceiverId)
	res, err := db.Exec(query)

	if err != nil {
		panic(err.Error())
	}

	rows, _ := res.RowsAffected()
	return rows == 1
}

// DB function for retrieving all received ratings of tutor
// returns an array of type Rating of all received ratings
func DB_retrieveReceivedRatings(tutorId string) []Rating {
	var ratingArray []Rating

	query := fmt.Sprintln(`SELECT * FROM Ratings WHERE receiverId = '%s';`, tutorId)
	res, err := db.Query(query)

	if err != nil {
		panic(err.Error())
	}

	for res.Next() {
		var r Rating
		res.Scan(&r.Id, &r.Rating, &r.RaterId, &r.RaterType, &r.ReceiverId, &r.ReceiverType, &r.PublishedDatetime, &r.Anonymous)
		ratingArray = append(ratingArray, r)
	}

	return ratingArray
}

// DB function for retrieving all anonymous ratings of tutor
// returns an array of type Rating of all anonymous ratings
func DB_retrieveAnonRatings(tutorId string) []Rating {
	var ratingArray []Rating

	query := fmt.Sprintf(
		`SELECT * FROM Ratings WHERE receiverId = '%s' AND anonymous = true;`, tutorId)
	res, err := db.Query(query)

	if err != nil {
		panic(err.Error())
	}

	for res.Next() {
		var r Rating
		res.Scan(&r.Id, &r.Rating, &r.RaterId, &r.RaterType, &r.ReceiverId, &r.ReceiverType, &r.PublishedDatetime, &r.Anonymous)
		ratingArray = append(ratingArray, r)
	}

	return ratingArray
}

// DB function for retrieving all of tutor's given ratings
// returns an array of type Rating of all tutor's given ratings
func DB_retrieveGivenRatings(tutorId string) []Rating {
	var ratingArray []Rating

	query := fmt.Sprintf(
		`SELECT * FROM Ratings WHERE raterId = '%s';`, tutorId)
	res, err := db.Query(query)

	if err != nil {
		panic(err.Error())
	}

	for res.Next() {
		var r Rating
		res.Scan(&r.Id, &r.Rating, &r.RaterId, &r.RaterType, &r.ReceiverId, &r.ReceiverType, &r.PublishedDatetime, &r.Anonymous)
		ratingArray = append(ratingArray, r)
	}

	return ratingArray
}

func main() {
	//start router
	router := mux.NewRouter()

	// setup routers
	router.HandleFunc("/api/v1", landing)
	router.HandleFunc("/api/v1/ratings", allRatings).Methods("GET", "POST", "PUT")
	router.HandleFunc("/api/v1/{tutorid}/ratings/received", ratingsReceived).Methods("GET")
	router.HandleFunc("/api/v1/{tutorid}/ratings/anon", anonRatings).Methods("GET")
	router.HandleFunc("/api/v1/{tutorid}/ratings/given", givenRatings).Methods("GET")
	router.HandleFunc("/api/v1/students", allStudents).Methods("GET")

	// establish db connection
	var err error
	//db, err = sql.Open("mysql", "root:password@tcp(db:3318)/rating_db")
	db, err = sql.Open("mysql", "root:password@tcp(127.0.0.1:3306)/rating_db")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	// specify allowed headers, methods, & origins to allow CORS
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"})
	origins := handlers.AllowedOrigins([]string{"*"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})

	fmt.Println("listening at port 8181")
	log.Fatal(http.ListenAndServe(":8181", handlers.CORS(headers, origins, methods)(router)))
}
