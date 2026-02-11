import { HandleRouting } from "./router.js"
import { checkAuth } from "./utils/utils.js"

const currentPath = window.location.pathname

if (currentPath === "/") {
    const user = await checkAuth()

    if (user.loggedIn) window.history.pushState({}, "", "/posts")
    else window.history.pushState({}, "", "/register")

}

HandleRouting()