package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"real-time-forum/internal/handlers"
	"real-time-forum/internal/models"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "../internal/database/real-time-forum.db")
	if err != nil {
		fmt.Println("error cearting db file: ", err)
		return
	}

	defer db.Close()

	if err := db.Ping(); err != nil {
		fmt.Println("db ping error:", err)
		return
	}

	_, err = db.Exec(models.Initialize)
	if err != nil {
		fmt.Println("error creating tables: ", err)
		return
	}

	app := &handlers.App{
		DB: db,
	}

	go handlers.Broadcast(db)

	http.HandleFunc("/", app.HomeHanlder)
	http.HandleFunc("/register", app.HandleRegister)
	http.HandleFunc("/login", app.HandleLogin)
	http.HandleFunc("/logout", app.LogoutHandler)
	http.HandleFunc("/statics/", handlers.ServeStatic)
	http.HandleFunc("/ws/chat", app.WebsocketHandler)

	fmt.Println("Server started. Go to http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println("error while starting the server")
		return
	}
}
