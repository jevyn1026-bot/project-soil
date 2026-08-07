let user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

async function loadUserProfile(){

    const response = await fetch("/api/auth/me", {
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    user = await response.json();

    localStorage.setItem("user", JSON.stringify(user));

    document.getElementById("userName").textContent = user.fullName;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("userPoints").textContent = user.points;
    document.getElementById("userLevel").textContent = user.level;

    document.getElementById("userBadges").textContent =
        user.badges.length > 0
        ? user.badges.join(", ")
        : "No badges yet";
}

loadUserProfile();

// Load reports
async function loadMyReports() {
    try {
const response = await fetch("/reports/my", {
    headers: {
        Authorization: `Bearer ${token}`
    }
});

        const reports = await response.json();

        const container = document.getElementById("myReports");

        if (reports.length === 0) {
            container.innerHTML = "<p>You haven't submitted any reports yet.</p>";
            return;
        }

        container.innerHTML = "";

        reports.forEach(report => {
            container.innerHTML += `
                <div class="report-card">
                    <h4>${report.type}</h4>
                    <p><strong>📍 Barangay:</strong> ${report.barangay}</p>
                    <p><strong>📅 Date:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
                    <p><strong>Status:</strong> ${report.status}</p>
                </div>
                <hr>
            `;
        });

    } catch (err) {
        console.error(err);
    }
}

loadMyReports();

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
});
