const accountButton = document.getElementById("account");
const logoutButton = document.getElementById("logout");
const modal = document.getElementById("modal");
const closeButton = document.getElementsByClassName("close")[0];
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginBox = document.getElementById("login-box");
const registerBox = document.getElementById("register-box");

document.addEventListener("DOMContentLoaded", function () {
    const username = "lillian";
    const password = "!mop12";

    localStorage.setItem(username, password);
    localStorage.setItem(`${username}-fav-pkm`, "494|384|176|");
    // logoutButton.style.display = "none";
});

accountButton.addEventListener("click", function () {
    modal.style.display = "block";
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    loginBox.classList.add("active");
    registerBox.classList.remove("active");
});

logoutButton.addEventListener("click", function () {
    if (window.accountName === undefined) {
        alert("You must be logged in to log out!");
        return;
    }

    accountName = undefined;
    user.innerHTML = "Hello!";
    alert("Logout successful!");
});

closeButton.addEventListener("click", function () {
    modal.style.display = "none";
});

registerBox.addEventListener("click", function () {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    loginBox.classList.remove("active");
    registerBox.classList.add("active");
});

loginBox.addEventListener("click", function () {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
    registerBox.classList.remove("active");
    loginBox.classList.add("active");
});

document.getElementById("login-box-register").addEventListener("click", function () {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    loginBox.classList.add("active");
    registerBox.classList.remove("active");
});

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", function () {
    const usernameInput = document.getElementById("login-username").value.toLowerCase();
    const passwordInput = document.getElementById("login-password").value;
    const error = document.getElementById("login-error");
    const user = document.getElementById("user");

    if (usernameInput.endsWith("-fav-pkm")) {
        error.innerHTML = "Invalid username";
        error.style.color = "red";
        return;
    }

    const storedPassword = localStorage.getItem(usernameInput);
    if (storedPassword !== null && storedPassword === passwordInput.toLowerCase()) {
        modal.style.display = "none";
        accountName = usernameInput;
        user.innerHTML = `Welcome back, ${accountName}!`;
        alert(`Login successful!\nWelcome back, ${accountName}!`);
    } else if (storedPassword === null) {
        error.innerHTML = "Please register";
        error.style.color = "red";
    } else {
        error.innerHTML = "Password does not match";
        error.style.color = "red";
    }
});

const registerButton = document.getElementById("register-button");
registerButton.addEventListener("click", function () {
    const usernameInput = document.getElementById("register-username").value.toLowerCase();
    const passwordInput = document.getElementById("register-password").value;
    const error = document.getElementById("register-error");

    if (ValidateRegistry(usernameInput, passwordInput, error)) {
        localStorage.setItem(usernameInput, passwordInput);
        localStorage.setItem(`${usernameInput}-fav-pkm`, "");
        modal.style.display = "none";
        alert(`Registration successful!\nPlease login to continue!`);
    }
});

function ValidateRegistry(username, password, error) {
    const noInput = [""];
    if (noInput.includes(username)) {
        error.innerHTML = "Please enter a username";
        error.style.color = "red";
        return false;
    } else if (noInput.includes(password)) {
        error.innerHTML = "Please enter a password";
        error.style.color = "red";
        return false;
    }

    const invalidPhrase = ["-fav-pkm"];
    const invalidEnd = invalidPhrase.some((suffix) => username.endsWith(suffix));
    if (invalidEnd) {
        error.innerHTML = "Username cannot end with -fav-pkm";
        error.style.color = "red";
        return false;
    }

    const invalidUsername = ["xen", "xentrix", "xentriom"];
    if (invalidUsername.includes(username)) {
        error.innerHTML = "Username not allowed";
        error.style.color = "red";
        return false;
    }

    const isUsernameExists = checkUsernameExists(username);
    if (isUsernameExists) {
        error.innerHTML = "Username already exists";
        error.style.color = "red";
        return false;
    }

    if (password.length < 2) {
        error.innerHTML = "Password must be at least 2 characters";
        error.style.color = "red";
        return false;
    }

    if (username.length > 8) {
        error.innerHTML = "User cannot be longer than 8 characters";
        error.style.color = "red";
        return false;
    }

    return true;
}

function checkUsernameExists(username) {
    const storedData = localStorage.getItem(username);
    return storedData !== null;
}