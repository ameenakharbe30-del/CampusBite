






// ===============================
// STAFF LOGIN
// ===============================

const togglePassword =
    document.getElementById("togglePassword");

const password =
    document.getElementById("password");


// Show / hide password

togglePassword.addEventListener(
    "click",
    function () {

        if (password.type === "password") {

            password.type = "text";

            togglePassword.textContent = "Hide";

        } else {

            password.type = "password";

            togglePassword.textContent = "Show";

        }

    }
);


// ===============================
// LOGIN
// ===============================

async function staffLogin() {

    const canteen =
        document.getElementById("canteen").value;

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("login-message");


    if (!canteen || !username || !password) {

        message.textContent =
            "Please fill all login details.";

        return;
    }


    try {

        const response = await fetch(
            "http://127.0.0.1:8000/api/staff-login/",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    canteen: canteen,
                    username: username,
                    password: password
                })
            }
        );


        const result = await response.json();


        if (!response.ok) {

            message.textContent =
                result.error || "Login failed.";

            return;
        }


        localStorage.setItem(
            "staffCanteen",
            result.canteen
        );


        window.location.href =
            result.redirect;


    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to server.";

    }

}