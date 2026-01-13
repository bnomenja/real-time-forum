package handlers

import (
	"database/sql"
	"fmt"
	"html/template"
	"net/http"
)

type App struct {
	DB *sql.DB
}

func (a *App) HomeHanlder(w http.ResponseWriter, r *http.Request) {
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
