package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"net/http"
	"strings"

	"real-time-forum/internal/models"

	"golang.org/x/crypto/bcrypt"
)

func (a *App) HandleRegister(w http.ResponseWriter, r *http.Request) {
	switch r.Method {

	case http.MethodGet:
		if len(r.URL.RawQuery) > 0 {
			// render a 405 error
			return
		}

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
		var resp models.Resp

		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			fmt.Println("error decoding the body: ", err)
			// render error 500
			return
		}

		hashedPw, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

		_, err = a.DB.Exec(
			models.Insert_user,
			user.FirstName,
			user.LastName,
			user.Nickname,
			user.Email,
			user.Age,
			user.Gender,
			string(hashedPw),
		)

		if err == nil {
			resp.Message = "You are registered"
			resp.Code = http.StatusOK			
		} else {
			msg := err.Error()

			switch {
			case strings.Contains(msg, "user.email"):
				resp.Error = errors.New("An account with this email already exists")
				resp.Code = http.StatusConflict

			case strings.Contains(msg, "user.nickname"):
				resp.Error = errors.New("This nickname is already taken")
				resp.Code = http.StatusConflict

			default:
				fmt.Println("error inserting user's data:", err)
				// render 500
				return
			}
		}

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
