import { currentUser } from "./chat.js"
import { HandleRouting } from "./router.js"

export const handleLogoutFront = async () => {
    try {
        await fetch("/logout", { method: "POST" })
        currentUser.socket.close()
        currentUser.socket = null

        window.history.pushState({}, "", "/")
        HandleRouting()
    } catch (err) {
        console.error(err)
    }
}
