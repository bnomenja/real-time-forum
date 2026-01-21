export const homeTemplate = () => {
    return `
        <nav class="home-nav">
            <a href="/" class="link">Home</a>
            <a href="/register" class="link">Register</a>
            <a href="/login" class="link">Login</a>
            <a href="/chat" class="link">Chat</a>
        </nav>
        <div class="home-content">
            <h1>Bienvenue</h1>
            <p>Connectez-vous ou créez un compte pour accéder au chat</p>
        </div>
    `
}

export const registerTemplate = () => {
    return `
        <h1>Register</h1>
        <div class="form-container register">
            <div class="input-error"></div>

            <div class="form-row">
                <label for="firstName">First name:</label>
                <input type="text" id="firstName" name="first-name" required maxlength="15">
            </div>

            <div class="form-row">
                <label for="lastName">Last name:</label>
                <input type="text" id="lastName" name="last-name" required maxlength="30">
            </div>

            <div class="form-row">
                <label for="nickName">Nickname:</label>
                <input type="text" id="nickName" name="nickname" required maxlength="20">
            </div>

            <div class="form-row">
                <label for="age">Age:</label>
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
                <label for="email">E-mail:</label>
                <input type="email" id="email" name="email" required maxlength="50">
            </div>

            <div class="form-row">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required maxlength="20" minlength="6">
            </div>

            <button id="register-submit-btn">Sign Up</button>

            <p>You already have an account?
                <a href="/login" class="link">Sign in</a>
            </p>
        </div>
    `
}
export const loginTemplate = () => {
    return `
        <h1>Login</h1>
        <form class="form-container login" novalidate>
            <div class="input-error" role="alert"></div>

            <div class="form-row">
                <label for="identifier">Email/Nickname:</label>
                <input 
                    type="text" 
                    id="identifier" 
                    name="identifier" 
                    required 
                    maxlength="50" 
                    autocomplete="username"
                    placeholder="email or nickname">
            </div>

            <div class="form-row">
                <label for="password">Password:</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    required 
                    minlength="6" 
                    maxlength="20"
                    autocomplete="current-password" 
                    placeholder="password">
            </div>

            <button type="submit" id="login-submit-btn">Sign in</button>

            <p>
                Don't have an account?
                <a href="/register" class="link">Sign up</a>
            </p>
        </form>
    `
}

export const chatTemplate = () => {
    return `
        <div class="global-container">
            <div class="user-list-container">
                <h3>Users</h3>
                <div class="user-list-wrapper"></div>
            </div>

            <div class="chat-container">
                <div id="messages">
                <img src="statics/assets/sleep.png" alt="sleep-icon" id="sleep-icon">
                </div>

                <div id="chat-input">
                    <textarea 
                        id="chat-textarea" 
                        rows="1" 
                        placeholder="Écrire un message…"></textarea>
                    <button id="send-btn">📨</button>
                </div>
            </div>
        </div>
    `
}