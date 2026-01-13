package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"net/http"
	"strings"
	"time"

	"real-time-forum/internal/models"

	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

func (a *App) HandleRegister(w http.ResponseWriter, r *http.Request) {
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

		var user models.User
		resp := models.Resp{
			Code:    200,
			Message: "you're loged in",
			Error:   nil,
		}

		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			fmt.Println("error decoding the body: ", err)
			// render error 500
			return
		}

		hashedPw, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			fmt.Println("error hashing password: ", err)
			// render error 500
			return
		}

		user_id, err := uuid.NewV4()
		if err != nil {
			fmt.Println("error creating user id: ", err)
			// render error 500
			return
		}

		_, err = a.DB.Exec(
			models.Insert_user,
			user_id.String(),
			user.FirstName,
			user.LastName,
			user.Nickname,
			user.Email,
			user.Age,
			user.Gender,
			string(hashedPw),
		)
		if err != nil {
			msg := err.Error()

			switch {
			case strings.Contains(msg, "user.email"):
				resp.Error = errors.New("an account with this email already exists")
				resp.Code = http.StatusConflict

			case strings.Contains(msg, "user.nickname"):
				resp.Error = errors.New("this nickname is already taken")
				resp.Code = http.StatusConflict

			default:
				fmt.Println("error inserting user's data:", err)
				// render 500
				return
			}
		}

		session_id, err := uuid.NewV4()
		if err != nil {
			fmt.Println("error creating session id: ", err)
			// render error 500
			return
		}

		expireTime := time.Now().Add(24 * time.Hour)

		_, err = a.DB.Exec(models.Insert_session, session_id.String(), user_id.String(), expireTime)
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
