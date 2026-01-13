import { handleLoginFront } from "./login.js"
import { handleregisterFront } from "./register.js"

const routes = {
    404: "/statics/templates/404.html",
    "/": "/statics/templates/home.html",
    "/register": "/statics/templates/register.html",
    "/login": "/statics/templates/login.html",
}

const scripts = {
    404: "/statics/js/404.js",
    "/": "/statics/js/home.js",
    "/register": "/statics/js/register.js",
    "/login": "/statics/js/login.js",
}

let oldScript = document.getElementById("script")

const handleRouting = async () => {
    const path = window.location.pathname
    const route = routes[path] || routes[404]
    const scriptPath = scripts[path] || scripts[404]

    const html = await fetch(route).then(resp => resp.text())
    document.getElementById("main").innerHTML = html

    if (oldScript) oldScript.remove()

    const newscript = document.createElement("script")
    newscript.id = "script"
    newscript.src = scriptPath
    newscript.type = "module"
    document.body.append(newscript)

    oldScript = newscript
}

document.addEventListener("click", (e) => {
    if (e.target.matches('a.link')) {
        e.preventDefault()
        window.history.pushState({}, "", e.target.href)
        handleRouting()
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
})

window.onpopstate = handleRouting
handleRouting()