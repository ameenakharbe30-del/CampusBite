const loginForm = document.getElementById("student-login-form");
const loginError = document.getElementById("login-error");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("student-email").value.trim();
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
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            // Save logged-in student
            localStorage.setItem("studentEmail", data.email);
            localStorage.setItem("studentUsername", data.username);
            localStorage.setItem("studentLoggedIn", "true");

            // Go to homepage
            window.location.href = data.redirect;

        } else {

            loginError.textContent =
                data.error || "Unable to login";

            loginError.classList.remove("hidden");
        }

    } catch (error) {

        console.error(error);

        loginError.textContent =
            "Unable to connect to the server. Please try again.";

        loginError.classList.remove("hidden");
    }
});