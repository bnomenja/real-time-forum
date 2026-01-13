package handlers

import (
	"fmt"
	"net/http"
	"time"

	"real-time-forum/internal/models"
)

func (a *App) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		// render error 405
		return
	}

	cookie, err := r.Cookie("session")
	if err != nil {
		fmt.Println("no cookie")
		return
	}

	session_ID := cookie.Value

	_, err = a.DB.Exec(models.Delete_session_by_id, session_ID)
	if err != nil {
		fmt.Println("failed to delete session: ", err)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "session",
		Value:   "",
		Expires: time.Time{},
		MaxAge:  -1,
	})
}
