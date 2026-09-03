// ===============================
// STAFF DASHBOARD PROTECTION
// ===============================

const loggedCanteen =
    localStorage.getItem("staffCanteen");


// No login
if (!loggedCanteen) {

    window.location.href = "staff-login.html";

}