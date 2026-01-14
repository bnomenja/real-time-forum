package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"real-time-forum/internal/helpers"
	"real-time-forum/internal/models"

	"github.com/gorilla/websocket"
)

var (
	connect    = make(chan models.Client)
	disconnect = make(chan models.Client)
	broadcast  = make(chan models.Message)
)

func (a *App) WebsocketHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		helpers.Respond(w, &models.Resp{
			Code:  405,
			Error: fmt.Errorf("method not allowed"),
		})

		return
	}

	cookie, err := r.Cookie("session")
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var nickname string
	err = a.DB.QueryRow(`
        SELECT u.nickname
        FROM user u
        JOIN session s ON s.user_id = u.id
        WHERE s.id = ?
    `, cookie.Value).Scan(&nickname)
	if err != nil {
		http.Error(w, "invalid session", http.StatusUnauthorized)
		return
	}

	upgrader := websocket.Upgrader{}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	client := models.Client{
		NickName: nickname,
		Ws:       ws,
	}

	connect <- client

	for {
		_, p, err := ws.ReadMessage()
		if err != nil {
			disconnect <- client
			ws.Close()
			return
		}

		var msg models.Message
		if err := json.Unmarshal(p, &msg); err != nil {
			helpers.Respond(w, &models.Resp{
				Code:  400,
				Error: fmt.Errorf("invalid payload"),
			})

			continue
		}

		broadcast <- msg
	}
}

func Broadcast(db *sql.DB) {
	clients := map[string]*websocket.Conn{}

	for {
		select {
		case client := <-connect:
			clients[client.NickName] = client.Ws
		case msg := <-broadcast:
			receirverConn, ok := clients[msg.Receiver]
			if !ok {
				continue
			}

			if err := receirverConn.WriteJSON(msg); err != nil {
				receirverConn.Close()
				delete(clients, msg.Receiver)
			}

		case client := <-disconnect:
			delete(clients, client.NickName)
		}
	}
}
