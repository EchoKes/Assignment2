package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type Rating struct {
	Ratingid          string `json:"RatingID"`
	Tutorid           string `json:"TutorID"`
	Studentid         string `json:"StudentID"`
	Ratingscore       int    `json:"RatingScore"`
	Datetimepublished string `json:"DatetimePublished"`
	Anonymous         bool   `json:"Anonymous"`
}

var db *sql.DB

func landing(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "~ Ratings & Comments Dashboard ~")
}

// View all ratings & comments
func GetAllRatings(w http.ResponseWriter, r *http.Request) {
	var ratings []Rating

}

func main() {
	//start router
	router := mux.NewRouter()

	// establish db connection
	// establish database connection
	var err error
	db, err = sql.Open("mysql", "root:password@tcp(db:3318)/rating_db")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	// specify allowed headers, methods, & origins to allow CORS
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"})
	origins := handlers.AllowedOrigins([]string{"*"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	router.HandleFunc("/", landing)

	fmt.Println("listening at port 8181")
	log.Fatal(http.ListenAndServe(":8181", handlers.CORS(headers, origins, methods)(router)))
}
