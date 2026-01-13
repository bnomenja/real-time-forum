package helpers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"real-time-forum/internal/models"
)

func GetData(r *http.Request, user *models.User, credentials *models.Credentials) error {
	if user != nil {
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			fmt.Println("error decoding the body: ", err)
			return fmt.Errorf("something wrong happened. Please try later")
		}

	} else {
		err := json.NewDecoder(r.Body).Decode(&credentials)
		if err != nil {
			fmt.Println("error decoding the body: ", err)
			return fmt.Errorf("something wrong happened. Please try later")
		}
	}

	return nil
}
