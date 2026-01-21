package models

import (
	"time"

	"github.com/gorilla/websocket"
)

type User struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Nickname  string `json:"nickname"`
	Age       int    `json:"age"`
	Gender    string `json:"gender"`
	Password  string `json:"password"`
	Email     string `json:"email"`
}

type Credentials struct {
	Nickname string `json:"nickname"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Client struct {
	ID       string
	NickName string
	Ws       *websocket.Conn
}

type Message struct {
	Type     string    `json:"type"`
	Sender   string    `json:"sender"`
	Receiver string    `json:"receiver"`
	Content  string    `json:"content"`
	Time     time.Time `json:"time"`
	Offset   int       `json:"offset"`
}

type OtherClient struct {
	LastChat time.Time `json:"lastChat"`
	NickName string    `json:"nickname"`
	Online   bool      `json:"online"`
}

type Resp struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
	Error   error  `json:"error"`
}
