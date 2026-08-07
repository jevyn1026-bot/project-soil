document.addEventListener("DOMContentLoaded", () => {

    const loginTab = document.getElementById("tab-login");
    const registerTab = document.getElementById("tab-register");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const errorMsg = document.getElementById("auth-error-msg");

    // Switch between Login and Register tabs
    loginTab.addEventListener("click", () => {
        loginTab.classList.add("active");
        registerTab.classList.remove("active");

        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");

        errorMsg.textContent = "";
    });

    registerTab.addEventListener("click", () => {
        registerTab.classList.add("active");
        loginTab.classList.remove("active");

        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");

        errorMsg.textContent = "";
    });

    // LOGIN
    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        errorMsg.textContent = "";

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                errorMsg.textContent = "❌ " + data.message;
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            window.location.href = "citizen-dashboard.html";

        } catch (err) {
            errorMsg.textContent = "❌ Unable to connect to the server.";
        }

    });

    // REGISTER
    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        errorMsg.textContent = "";

        const fullName = document.getElementById("reg-name").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;

        try {

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                errorMsg.textContent = "❌ " + data.message;
                return;
            }

            registerForm.reset();

            loginTab.click();

            errorMsg.textContent = "✅ Registration successful. Please sign in.";

        } catch (err) {
            errorMsg.textContent = "❌ Unable to connect to the server.";
        }

    });

});
