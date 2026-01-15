import { SendMessage } from "./chat.js"
import { handleLoginFront } from "./login.js"
import { handleregisterFront } from "./register.js"

const mainCont = document.getElementById('main-container')
const navBar = document.getElementById('nav-bar')

const initHome = () => {
    mainCont.innerHTML = `
        <nav>
        <a href="/" class="link">Home</a>
        <a href="/register" class="link">Register</a>
        <a href="/login" class="link">Login</a>
        <a href="/chat" class="link">chat</a>
        </nav>
    `
}

const initRegister = () => {
    mainCont.innerHTML = `
    <h1>Register</h1>
     <div class="form-container register">
        <div class="input-error"></div>

        <div class="form-row">
            <label>First name:</label>
            <input type="text" id="firstName" name="first-name" required maxlength="15">
        </div>

        <div class="form-row">
            <label>Last name:</label>
            <input type="text" id="lastName" name="last-name" required maxlength="30">
        </div>

        <div class="form-row">
            <label>Nickname:</label>
            <input type="text" id="nickName" name="nickname" required maxlength="20">
        </div>

        <div class="form-row">
            <label>Age:</label>
            <input type="number" id="age" name="age" required>
        </div>

        <div id="gender-container">
            <label>Gender:</label>
            <div class="gender-input">
                <label>
                    <input type="radio" id="male" name="gender" value="male">
                    Male
                </label>
                <label>
                    <input type="radio" id="female" name="gender" value="female">
                    Female
                </label>
            </div>
        </div>

        <div class="form-row">
            <label>E-mail:</label>
            <input type="email" id="email" name="email" required maxlength="50">
        </div>

        <div class="form-row">
            <label>Password:</label>
            <input type="password" id="password" name="password" required maxlength="20" minlength="6">
        </div>

        <button id="register-submit-btn">Sign In</button>

        <p>You already have an account?
            <a href="/login" class="link">Sign in</a>
        </p>
    </div>
    `
}

const initLogin = () => {
    mainCont.innerHTML = `
        <h1>Login</h1>

    <form class="form-container login" novalidate>
        <div class="input-error" role="alert"></div>

        <div class="form-row">
            <label for="identifier">Email/Nickname:</label>
            <input type="text" id="identifier" name="identifier" required maxlength="50" autocomplete="username"
                placeholder="email or nickname">
        </div>

        <div class="form-row">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required minlength="6" maxlength="20"
                autocomplete="current-password" placeholder="password">
        </div>

        <button type="submit" id="login-submit-btn">Sign in</button>

        <p>
            Don't have an account?
            <a href="/register" class="link">Sign up</a>
        </p>
    </form>
    `
}

const initChat = () => {
    navBar.innerHTML = `
        <div id="profile">
            <img src="statics/assets/user.png">

            <div class="button-container">
                <button>logout</button>
                <button>create post</button>
            </div>
        </div>
    `

    mainCont.innerHTML = `
    <div class="global-container">
        <div class="user-list-container">
            <div class="user-data">
                <div class="avatar">
                    <img src="statics/assets/user.png" alt="profile-img">
                        <div class="online-marker"></div>
                </div>

                <span>Alice</span>
            </div>

            <div class="user-data">
                <div class="avatar">
                    <img src="statics/assets/user.png" alt="profile-img">
                        <div class="online-marker"></div>
                </div>

                <span>Robert</span>
            </div>

            <div class="user-data">
                <div class="avatar">
                    <img src="statics/assets/user.png" alt="profile-img">
                        <div class="online-marker"></div>
                </div>

                <span>Bob</span>
            </div>
        </div>


        <div class="chat-container">
            <div class="user-data" id="receiver">
                <div class="avatar">
                    <img src="statics/assets/user.png" alt="profile-img">
                        <div class="online-marker"></div>
                </div>

                <span>Alice</span>
            </div>

                <div id="messages">
                    <div class="message message-other">Salut, tu vas bien ?</div>
                    <div class="message message-me">Oui, et toi ?</div>
                </div>

            <div id="chat-input">
                <textarea id="chat-textarea" rows="1" placeholder="Écrire un message…"></textarea>
                <button id="send-btn">📨</button>
            </div>
        </div>
    `
}

const routes = {
    "/": initHome,
    "/register": initRegister,
    "/login": initLogin,
    "/chat": initChat,
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
        SendMessage()
        return
    }

})


window.onpopstate = HandleRouting
HandleRouting()