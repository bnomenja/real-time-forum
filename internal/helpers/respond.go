package helpers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"real-time-forum/internal/models"
)

func Respond(w http.ResponseWriter, resp *models.Resp) {
	w.WriteHeader(resp.Code)
	w.Header().Set("content-type", "application/json")

	err := json.NewEncoder(w).Encode(&resp)
	if err != nil {
		fmt.Println("error encoding the body: ", err)
		// render error 500
		return
	}
}
