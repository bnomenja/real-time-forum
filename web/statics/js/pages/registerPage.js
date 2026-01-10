export const generateRegisterPage = () => {
  document.body.innerHTML = `
    <div id="register-container">
      <div class="input-error"></div>
      
      <div class="form-row">
        <label for="first-name">First name:</label>
        <input type="text" id="firstName" name="first-name" required maxlength="15">
      </div>
      
      <div class="form-row">
        <label for="last-name">Last name:</label>
        <input type="text" id="lastName" name="last-name" required maxlength="30">
      </div>
      
      <div class="form-row">
        <label for="nickname">Nickname:</label>
        <input type="text" id="nickName" name="nickname" required maxlength="20">
      </div>
      
      <div class="form-row">
        <label for="age">Age:</label>
        <input type="number" id="age" name="age" required>
      </div>
      
      <div id="gender-container">
        <label>Gender:</label>
        <label for="male">
          <input type="radio" id="male" name="gender" value="male">
          Male
        </label>
        <label for="female">
          <input type="radio" id="female" name="gender" value="female">
          Female
        </label>
      </div>
      
      <div class="form-row">
        <label for="email">E-mail:</label>
        <input type="email" id="email" name="email" required maxlength="50">
      </div>
      
      <div class="form-row">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required maxlength="20" minlength="6">
      </div>
      
      <button id="submit-btn" type="submit">Sign up</button>
    </div>
  `
}
