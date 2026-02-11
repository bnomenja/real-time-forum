package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"real-time-forum/backend/handlers"
	"real-time-forum/backend/websocket"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "../database/real-time-forum.db")
	if err != nil {
		fmt.Println("error creating db file: ", err)
		return
	}

	defer db.Close()

	if err := db.Ping(); err != nil {
		fmt.Println("db ping error:", err)
		return
	}

	data, err := os.ReadFile("./database/migrations/schema.sql")
	if err != nil {
		fmt.Println("error reading schema file: ", err)
		return
	}

	_, err = db.Exec(string(data))
	if err != nil {
		fmt.Println("error creating tables: ", err)
		return
	}

	go websocket.Broadcast(db)

	http.HandleFunc("/register", handlers.RegisterHandler(db))
	http.HandleFunc("/login", handlers.LoginHanlder)
	http.HandleFunc("/logout", handlers.LogoutHandler)
	http.HandleFunc("/api/posts", handlers.GetPostsHandler)
	http.HandleFunc("/api/post", handlers.GetPostsHandler)
	http.HandleFunc("/api/posts/create", handlers.CreatePostHandler)
	http.HandleFunc("/api/comments/add", handlers.AddCommentHandler)
	http.HandleFunc("/api/header-check", handlers.GetHeader(db))
	http.HandleFunc("/statics/", handlers.ServeStatic)
	http.HandleFunc("/ws/chat", handlers.WebsocketHandler)
	http.HandleFunc("/", handlers.HomeHanlder)

	fmt.Println("Server started. Go to http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println("error while starting the server")
		return
	}
}
