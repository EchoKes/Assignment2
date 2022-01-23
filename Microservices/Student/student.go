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

type Student struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

var db *sql.DB

func landing(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "~ Mock List of Student Info ~")
}

func allStudents(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		studentArray := DB_getStudentsDetails()
		json.NewEncoder(w).Encode(studentArray)
	}
}

// DB function for retrieving mock list of student details
// returns an array of type Student of all student
func DB_getStudentsDetails() []Student {
	var studentArray []Student

	query := "SELECT * FROM Students;"
	res, err := db.Query(query)

	if err != nil {
		panic(err.Error())
	}

	for res.Next() {
		var s Student
		res.Scan(&s.Id, &s.Name)
		studentArray = append(studentArray, s)
	}

	return studentArray
}

func main() {
	//start router
	router := mux.NewRouter()

	// setup routers
	router.HandleFunc("/landing", landing)
	router.HandleFunc("/students", allStudents).Methods("GET")

	// establish db connection
	var err error
	//db, err = sql.Open("mysql", "root:password@tcp(db:3318)/student_db") <- to change
	db, err = sql.Open("mysql", "root:password@tcp(studentDB:8187)/student_db")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	// specify allowed headers, methods, & origins to allow CORS
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"})
	origins := handlers.AllowedOrigins([]string{"*"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})

	fmt.Println("listening at port 8183")
	log.Fatal(http.ListenAndServe(":8183", handlers.CORS(headers, origins, methods)(router)))
}
