package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"net/http"
	"time"

	"real-time-forum/internal/models"

	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

func (a *App) HandleLogin(w http.ResponseWriter, r *http.Request) {
	switch r.Method {

	case http.MethodGet:
		tmpl, err := template.ParseFiles("../web/index.html")
		if err != nil {
			fmt.Println("error while parsing the template")
			// render a 500 error
			return
		}

		err = tmpl.Execute(w, nil)
		if err != nil {
			fmt.Println("error while executing the template")
			// render a 500 error
			return
		}

	case http.MethodPost:

		var credentials models.Credentials
		resp := models.Resp{
			Code:    200,
			Message: "you're loged in",
			Error:   nil,
		}

		err := json.NewDecoder(r.Body).Decode(&credentials)
		if err != nil {
			fmt.Println("error decoding the body: ", err)
			// render error 500
			return
		}

		var storedPassword string
		var user_id string

		if credentials.Nickname != "" {
			err := a.DB.QueryRow(models.Select_password_by_nickname, credentials.Nickname).Scan(&storedPassword, &user_id)

			if err == sql.ErrNoRows {
				resp.Error = errors.New("invalid credentials")
				resp.Code = http.StatusUnauthorized
				resp.Message = ""
			} else if err != nil {
				fmt.Println("error while getting data by nickname: ", err)
				return
			}

		} else if credentials.Email != "" {
			err := a.DB.QueryRow(models.Select_password_by_email, credentials.Email).Scan(&storedPassword, &user_id, &credentials.Nickname)

			if err == sql.ErrNoRows {
				resp.Error = errors.New("invalid credentials")
				resp.Code = http.StatusUnauthorized
				resp.Message = ""
			} else if err != nil {
				fmt.Println("error while getting data by email: ", err)
				return
			}

		} else {
			// render 400 error
			fmt.Println("empty identifiers")
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(credentials.Password))
		if err != nil {
			// render  error unhauthorize
			return
		}

		_, err = a.DB.Exec(models.Delete_session_by_user_id, user_id)
		if err != nil {
			fmt.Println("failed to delete the session: ", err)
			return
		}

		session_id, err := uuid.NewV4()
		if err != nil {
			fmt.Println("error creating session id: ", err)
			// render error 500
			return
		}

		expireTime := time.Now().Add(24 * time.Hour)

		_, err = a.DB.Exec(models.Insert_session, session_id.String(), user_id, expireTime)
		if err != nil {
			fmt.Println("error inserting session's data:", err)
			return
		}

		cookie := &http.Cookie{
			Name: "session",
			Value:    session_id.String(),
			Expires:  expireTime,
			HttpOnly: true,
			Secure:   false,
			SameSite: http.SameSiteStrictMode,
			Path:     "/",
		}

		http.SetCookie(w, cookie)

		w.WriteHeader(resp.Code)
		w.Header().Set("content-type", "application/json")
		err = json.NewEncoder(w).Encode(&resp)
		if err != nil {
			fmt.Println("error encoding the body: ", err)
			// render error 500
			return
		}
	default:
		// render error method not allowed
	}
}
