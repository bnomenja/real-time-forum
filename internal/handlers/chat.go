package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"real-time-forum/internal/models"

	"github.com/gofrs/uuid"
	"github.com/gorilla/websocket"
)

var (
	connect    = make(chan models.Client)
	disconnect = make(chan models.Client)
	broadcast  = make(chan models.Message)
)

func (a *App) WebsocketHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session")
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var nickname string
	var id string
	err = a.DB.QueryRow(`
        SELECT u.nickname, u.id
        FROM user u
        JOIN session s ON s.user_id = u.id
        WHERE s.id = ?
    `, cookie.Value).Scan(&nickname, &id)
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
		ID:       id,
		NickName: nickname,
		Ws:       ws,
	}

	connect <- client

	for {
		_, payload, err := ws.ReadMessage()
		if err != nil {
			disconnect <- client
			ws.Close()
			return
		}

		var msg models.Message

		if err := json.Unmarshal(payload, &msg); err != nil {
			ws.WriteJSON(map[string]string{
				"type": "error",
				"msg":  "invalid message format",
			})
			fmt.Println("errooooor:", err)
			continue
		}

		msg.Sender = client.NickName

		broadcast <- msg
	}
}

func Broadcast(db *sql.DB) {
	clients := map[string]*websocket.Conn{}

	for {
		select {
		case client := <-connect:
			clients[client.NickName] = client.Ws
			users := []models.OtherClient{}

			row, err := db.Query(`SELECT nickname FROM user WHERE id != ?`, client.ID)
			if err != nil {
				fmt.Println("error while getting all users", err)
				// render error 500
				return
			}

			defer row.Close()

			for row.Next() {
				user := models.OtherClient{Online: false}

				if err := row.Scan(&user.NickName); err != nil {
					fmt.Println("error while getting one users", err)
					// render error 500
					return
				}

				otherConn, ok := clients[user.NickName]
				if ok {
					user.Online = true
					var resp struct {
						Event string `json:"event"`
						User  string `json:"user"`
					}

					resp.Event = "join"
					resp.User = client.NickName

					otherConn.WriteJSON(resp)
				}

				users = append(users, user)
			}

			var resp struct {
				Event string               `json:"event"`
				Users []models.OtherClient `json:"users"`
			}

			resp.Event = "init"
			resp.Users = users

			client.Ws.WriteJSON(resp)

		case msg := <-broadcast:
			receiverConn, ok := clients[msg.Receiver]
			if !ok {
				fmt.Println("receiver is not online")
			} else {
				var resp struct {
					Event       string         `json:"event"`
					MessageData models.Message `json:"message"`
				}

				resp.Event = "chat"
				resp.MessageData = msg

				if err := receiverConn.WriteJSON(resp); err != nil {
					receiverConn.Close()
					delete(clients, msg.Receiver)
					continue
				}
			}

			message_id, err := uuid.NewV4()
			if err != nil {
				fmt.Println("error generating id: ", err)
				// render error 500
				return
			}

			_, err = db.Exec(`
    		INSERT INTO private_message (id, sender_id, receiver_id, content, created_at)
    		VALUES (?,
        	(SELECT id FROM user WHERE nickname = ?),
        	(SELECT id FROM user WHERE nickname = ?),
			?,?)
			`,
				message_id.String(),
				msg.Sender,
				msg.Receiver,
				msg.Content,
				msg.Time,
			)
			if err != nil {
				fmt.Println("error inserting msg in database: ", err)
				// render error 500
				return
			}

		case client := <-disconnect:
			delete(clients, client.NickName)
		}
	}
}
