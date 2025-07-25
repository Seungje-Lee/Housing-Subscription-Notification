const email = document.querySelector("#email");
const password = document.querySelector("#password");
const loginForm = document.querySelector("#login-form");

function handleLogin(event) {
  event.preventDefault();
  console.log(email.value, password.value);
}

loginForm.addEventListener("submit", handleLogin);