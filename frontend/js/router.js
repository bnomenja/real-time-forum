import { initRegister, handleregisterFront } from "./components/auth/register.js"


const routes = {
    "/register": initRegister,
    "/": async () => {
        const user = await checkAuth()

        if (user.loggedIn) window.history.pushState({}, "", "/posts")
        else window.history.pushState({}, "", "/register")
    
        HandleRouting()
    }
}

export const HandleRouting = async () => {
    const mainCont = document.getElementById('main-container')
    const navBar = document.getElementById('nav-bar')

    const path = window.location.pathname

    const initFunc = routes[path]

    if (!initFunc) {
        navBar.innerHTML = ''
        mainCont.innerHTML = `
        <div class="error-container">
            <h1>Error 404</h1>
            <p>Page not found</p>
            <a href="/" class="link">Back to home</a>
        </div>
    `
        return
    }

    try {
        const result = initFunc(mainCont, navBar)
        if (result && typeof result.then === 'function') {
            await result
        }

    } catch (error) {
        console.error('Error in route handler:', error)
        navBar.innerHTML = ''
        mainCont.innerHTML = `
        <div class="error-container">
            <h1>Error 500</h1>
            <p>Something wrong happened</p>
            <a href="/" class="link">Back to home</a>
        </div>
    `
    }
}

window.onpopstate = HandleRouting
HandleRouting()

document.addEventListener("click", (e) => {
    if (e.target.id === 'register-submit-btn') {
        e.preventDefault()
        handleregisterFront()
        return
    }
})
