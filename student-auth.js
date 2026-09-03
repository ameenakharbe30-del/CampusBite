const studentLoggedIn = localStorage.getItem("studentLoggedIn");
const studentEmail = localStorage.getItem("studentEmail");

if (studentLoggedIn !== "true" || !studentEmail) {
    window.location.href = "student-login.html";
}