package models

type Resp struct {
	Code  int    `json:"code"`
	Error string `json:"error"`
}

type User struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Nickname  string `json:"nickname"`
	Age       int    `json:"age"`
	Gender    string `json:"gender"`
	Password  string `json:"password"`
	Email     string `json:"email"`
}
