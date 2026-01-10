package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"text/template"
)

type App struct {
	DB *sql.DB
}

func (a *App) HomeHanlder(w http.ResponseWriter, r *http.Request) {
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
}
