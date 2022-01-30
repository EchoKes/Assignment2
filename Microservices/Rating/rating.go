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

var db *sql.DB

func landing(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "~ Ratings & Comments Dashboard ~")
}

// Retrieve all ratings, Post a rating on student, Update a rating given to a student
func allRatings(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	studentId := params["studentid"]
	// {Part 1: Retrieve all ratings}
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
			ratings := DB_retrieveAllRatings(studentId, showid)
			json.NewEncoder(w).Encode(ratings)
			w.WriteHeader(http.StatusAccepted)
			// w.Write([]byte("202 - All ratings retrieved"))
		} else {
			w.WriteHeader(http.StatusNotAcceptable)
			w.Write([]byte("No url query or incorrect id value in url query. Please use 1 for true, 0 for false."))
		}
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

		// {Part 2: Rate a student}
		if r.Method == "POST" {
			// Create tutor's rating for student
			if DB_insertRating(rating) {
				w.WriteHeader(http.StatusCreated)
				w.Write([]byte("201 - Rating created"))
			} else {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte("400 - Unable to create rating"))
			}

		}
		// {Part 3: Update rating on a student}
		if r.Method == "PUT" {
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

// View all given ratings
func givenRatings(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		params := mux.Vars(r)
		tutorId := params["tutorid"]
		ratings := DB_retrieveGivenRatings(tutorId)
		json.NewEncoder(w).Encode(ratings)
		w.WriteHeader(http.StatusAccepted)
		// w.Write([]byte("202 - All given ratings retrieved"))
	}
}

func ratingFromTutor(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		params := mux.Vars(r)
		tutorId := params["tutorid"]
		studentId := params["studentid"]
		ratingDetails := DB_retrieveRatingFromTutor(tutorId, studentId)
		json.NewEncoder(w).Encode(ratingDetails)
		w.WriteHeader(http.StatusAccepted)
		// w.Write([]byte("202 - Tutor details received"))
	}
}

// DB function for retrieving all ratings of student
// returns an array of type Rating of all ratings
func DB_retrieveAllRatings(receiverId string, showid bool) []Rating {
	var ratingArray []Rating

	query := fmt.Sprintf(`
	SELECT * FROM Ratings WHERE receiverId = '%s'
	ORDER BY datetime desc;`, receiverId)
	res, err := db.Query(query)

	if err != nil {
		panic(err.Error())
	}

	for res.Next() {
		var r Rating
		res.Scan(&r.Id, &r.Rating, &r.RaterId, &r.RaterType, &r.ReceiverId, &r.ReceiverType, &r.PublishedDatetime, &r.Anonymous)

		if !showid {
			if r.Anonymous {
				r.RaterId = ""
			}
		}
		ratingArray = append(ratingArray, r)
	}

	return ratingArray
}

// DB function for tutor rating a student, AKA creation of rating
// returns true if insert is successful
func DB_insertRating(rating Rating) bool {
	query := fmt.Sprintf(
		`INSERT INTO Ratings(rating, raterId, raterType, receiverId, receiverType, datetime, anonymous)
		 VALUES('%d', '%s', 'tutor', '%s', 'student', NOW(), %t);`,
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
		`UPDATE Ratings SET rating = '%d', datetime = NOW(), anonymous = %t WHERE raterId = '%s' AND receiverId = '%s';`,
		rating.Rating, rating.Anonymous, rating.RaterId, rating.ReceiverId)
	res, err := db.Exec(query)

	if err != nil {
		panic(err.Error())
	}

	rows, _ := res.RowsAffected()
	return rows == 1
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

// DB function for retrieving rating given to a student by certain tutor
func DB_retrieveRatingFromTutor(tutorId string, studentId string) Rating {
	var r Rating
	r.Rating = -1
	r.RaterId = tutorId
	r.RaterType = "tutor"
	r.ReceiverId = studentId
	r.ReceiverType = "student"

	query := fmt.Sprintf(
		`SELECT * FROM Ratings WHERE raterId = '%s' 
		AND receiverId = '%s'`, tutorId, studentId)
	res, err := db.Query(query)

	if err != nil {
		panic(err.Error())
	}

	if res.Next() {
		res.Scan(&r.Id, &r.Rating, &r.RaterId, &r.RaterType, &r.ReceiverId, &r.ReceiverType, &r.PublishedDatetime, &r.Anonymous)
	}

	return r
}

func main() {
	// environment variables
	BASE_STUDENT_API_URL := os.Getenv("BASE_RATINGS_API_STUDENT_URL")
	BASE_TUTOR_API_URL := os.Getenv("BASE_RATINGS_API_TUTOR_URL")

	// start router
	router := mux.NewRouter()

	// setup routers
	router.HandleFunc("/landing", landing)
	router.HandleFunc(BASE_STUDENT_API_URL, allRatings).Methods("GET", "POST", "PUT")
	router.HandleFunc(BASE_TUTOR_API_URL+"/given", givenRatings).Methods("GET")
	router.HandleFunc(BASE_STUDENT_API_URL+"/from/{tutorid}", ratingFromTutor).Methods("GET")

	// establish db connection
	var err error
	//db, err = sql.Open("mysql", "root:password@tcp(db:3318)/rating_db")
	db, err = sql.Open("mysql", "root:password@tcp(db_rating:8183)/rating_db")
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
