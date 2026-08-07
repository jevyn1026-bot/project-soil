const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const authRoutes = require("./routes/auth");

const { connectDB } = require("./database");

const reportRoutes = require("./routes/reports");
const leaderboardRoutes = require("./routes/leaderboard");
const rewardsRoutes = require("./routes/rewards");
const analyticsRoutes = require("./routes/analytics");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/leaderboard", leaderboardRoutes);
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Soil.html"));
});

app.get("/Soil.html", (req, res) => {
    res.sendFile(path.join(__dirname, "Soil.html"));
});

app.get("/report.html", (req, res) => {
    res.sendFile(path.join(__dirname, "report.html"));
});

app.get("/map.html", (req, res) => {
    res.sendFile(path.join(__dirname, "map.html"));
});

app.get("/admin-dashboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "admin-dashboard.html"));
});

app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "register.html"));
});

app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/leaderboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "leaderboard.html"));
});

app.use("/leaderboard", leaderboardRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/reports", reportRoutes);
const barangayRoute = require("./routes/barangay");
const adminRoutes = require("./routes/admin");

app.use("/admin", adminRoutes);

app.use("/api/barangay", barangayRoute);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🚀 Project Sun running on port ${PORT}`);
    });
}

startServer();
