const loginForm = document.getElementById("student-login-form");
const loginError = document.getElementById("login-error");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("student-id").value.trim();
    const password = document.getElementById("password").value;

    loginError.classList.add("hidden");
    loginError.textContent = "";

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/student-login/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            // Save logged-in student
            localStorage.setItem("studentUsername", data.username);
            localStorage.setItem("studentLoggedIn", "true");

            // Go to homepage
            window.location.href = data.redirect;

        } else {

            loginError.textContent =
                data.error || "Invalid username or password";

            loginError.classList.remove("hidden");
        }

    } catch (error) {

        console.error(error);

        loginError.textContent =
            "Unable to connect to the server. Please try again.";

        loginError.classList.remove("hidden");
    }
});