package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type Tutor struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

var db *sql.DB

func landing(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "~ Mock List of Tutor Info ~")
}

func allTutors(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		tutorArray := DB_getTutorsDetails()
		json.NewEncoder(w).Encode(tutorArray)
	}
}

// DB function for retrieving mock list of tutor details
// returns an array of type Tutor of all tutor
func DB_getTutorsDetails() []Tutor {
	var tutorArray []Tutor

	query := "SELECT * FROM Tutors;"
	res, err := db.Query(query)

	if err != nil {
		panic(err.Error())
	}

	for res.Next() {
		var s Tutor
		res.Scan(&s.Id, &s.Name)
		tutorArray = append(tutorArray, s)
	}

	return tutorArray
}

func main() {
	//start router
	router := mux.NewRouter()

	// setup routers
	router.HandleFunc("/landing", landing)
	router.HandleFunc("/tutors", allTutors).Methods("GET")

	// establish db connection
	var err error
	//db, err = sql.Open("mysql", "root:password@tcp(db:3318)/tutor_db") <- to change
	db, err = sql.Open("mysql", "root:password@tcp(db_tutor:8188)/tutor_db")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	// specify allowed headers, methods, & origins to allow CORS
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"})
	origins := handlers.AllowedOrigins([]string{"*"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})

	fmt.Println("listening at port 8184")
	log.Fatal(http.ListenAndServe(":8184", handlers.CORS(headers, origins, methods)(router)))
}
