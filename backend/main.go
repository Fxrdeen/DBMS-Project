package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

type User struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	ClerkId string `json:"clerkId"`

}

var db *pgxpool.Pool

func main() {
	erro:= godotenv.Load()
	if erro != nil {
		log.Fatalf("Error loading .env file")
	}
	dbPassword := os.Getenv("DB_PASSWORD")
	connStr := fmt.Sprintf("postgresql://fxr_ryde_owner:%s@ep-shiny-mode-a1mkltbm.ap-southeast-1.aws.neon.tech/fxr_ryde?sslmode=require", dbPassword)

	var err error
	db, err = pgxpool.New(context.Background(), connStr)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer db.Close()

	router := mux.NewRouter()
	router.HandleFunc("/user", getEmployees).Methods("GET")
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, 
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	fmt.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", c.Handler(router)))
}

func getEmployees(w http.ResponseWriter, r *http.Request) {
	// Query the database
	rows, err := db.Query(context.Background(), "SELECT * FROM users")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Prepare the response
	var employees []User
	for rows.Next() {
		var emp User
		err := rows.Scan(&emp.ID, &emp.Name, &emp.Email, &emp.ClerkId)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		employees = append(employees, emp)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(employees)
}
