import { homeTemplate, registerTemplate, loginTemplate, chatTemplate } from './templates.js'
import { handleChatFront, sendMessage, SwapChat } from './chat.js'
import { handleLoginFront } from './login.js'
import { handleregisterFront } from './register.js'

const mainCont = document.getElementById('main-container')
const navBar = document.getElementById('nav-bar')

const initHome = () => {
    navBar.innerHTML = ''
    mainCont.innerHTML = homeTemplate()
}

const initRegister = () => {
    navBar.innerHTML = ''
    mainCont.innerHTML = registerTemplate()
}

const initLogin = () => {
    navBar.innerHTML = ''
    mainCont.innerHTML = loginTemplate()
}

const initChat = () => {
    navBar.innerHTML = `
        <div id="profile">
            <img src="statics/assets/user.png" alt="profile">
            <div class="button-container">
                <button>logout</button>
                <button>create post</button>
            </div>
        </div>
    `
    mainCont.innerHTML = chatTemplate()
    handleChatFront()
}

const routes = {
    "/": initHome,
    "/register": initRegister,
    "/login": initLogin,
    "/chat": initChat,
}

const render404 = () => {
    navBar.innerHTML = ''
    mainCont.innerHTML = `
        <div class="error-container">
            <h1>404 - Page non trouvée</h1>
            <p>La page que vous recherchez n'existe pas.</p>
            <a href="/" class="link">Retour à l'accueil</a>
        </div>
    `
}

export const HandleRouting = () => {
    const path = window.location.pathname
    const initFunc = routes[path]

    if (!initFunc) {
        render404()
        return
    }

    initFunc()
}

document.addEventListener("click", (e) => {
    if (e.target.matches('a.link')) {
        e.preventDefault()
        window.history.pushState({}, "", e.target.href)
        HandleRouting()
    }

    if (e.target.id === 'register-submit-btn') {
        e.preventDefault()
        handleregisterFront()
        return
    }

    if (e.target.id === 'login-submit-btn') {
        e.preventDefault()
        handleLoginFront()
        return
    }

    if (e.target.id === 'send-btn') {
        e.preventDefault()
        sendMessage()
        handleChatFront()
        return
    }

    if (e.target.closest(".user-list-wrapper .nickname")) {
        SwapChat(e.target.textContent)
    }
})


window.onpopstate = HandleRouting
HandleRouting()