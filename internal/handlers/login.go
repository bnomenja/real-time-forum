package handlers

import (
	"fmt"
	"net/http"
	"text/template"
)

func (a *App) HandleLogin(w http.ResponseWriter, r *http.Request) {
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
		
	default:
		// render 405
		return
	}
}
