const accountButton = document.getElementById("account");
const modal = document.getElementById("modal");
const closeButton = document.getElementsByClassName("close")[0];
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginBox = document.getElementById("login-box");
const registerBox = document.getElementById("register-box");

accountButton.addEventListener("click", function () {
    modal.style.display = "block";
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    loginBox.classList.add("active");
    registerBox.classList.remove("active");
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
const registerButton = document.getElementById("register-button");

loginButton.addEventListener("click", function () {
    const usernameInput = document.getElementById("login-username").value;
    const passwordInput = document.getElementById("login-password").value;
    const error = document.getElementById("login-error");

    const storedPassword = localStorage.getItem(usernameInput);

    if (storedPassword !== null && storedPassword === passwordInput) {
        modal.style.display = "none";
    } else {
        if (storedPassword === null) {
            error.innerHTML = "Please register";
        } else {
            error.innerHTML = "Password does not match";
        }
        error.style.color = "red";
    }
});

registerButton.addEventListener("click", function () {
    const usernameInput = document.getElementById("register-username").value;
    const passwordInput = document.getElementById("register-password").value;
    const error = document.getElementById("register-error");

    const isUsernameExists = checkUsernameExists(usernameInput);

    if (isUsernameExists) {
        error.innerHTML = "Please login";
        error.style.color = "red";
    } else {
        localStorage.setItem(usernameInput, passwordInput);

        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                const ipAddress = data.ip;
                localStorage.setItem(`${usernameInput}-ip`, ipAddress);
            });

        modal.style.display = "none";
    }
});

function checkUsernameExists(username) {
    const storedData = localStorage.getItem(username);
    return storedData !== null;
}