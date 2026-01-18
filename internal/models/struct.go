package models

import (
	"github.com/gorilla/websocket"
)

type User struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Nickname  string `json:"nickName"`
	Age       int    `json:"age"`
	Gender    string `json:"gender"`
	Password  string `json:"password"`
	Email     string `json:"email"`
}

type Resp struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
	Error   error  `json:"error"`
}

type Credentials struct {
	Nickname string `json:"nickName"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Client struct {
	ID       string
	NickName string
	Ws       *websocket.Conn
}

type Message struct {
	Sender   string `json:"sender"`
	Receiver string `json:"receiver"`
	Content  string `json:"content"`
	Time     int64  `json:"time"`
}

type OtherClient struct {
	NickName string `json:"nickname"`
	Online   bool   `json:"online"`
}
