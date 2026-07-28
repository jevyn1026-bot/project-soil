const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { connectDB } = require("./database");

const reportRoutes = require("./routes/reports");
const analyticsRoutes = require("./routes/analytics");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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

app.use("/reports", reportRoutes);
app.use("/api/analytics", analyticsRoutes);

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🚀 Project Sun running on port ${PORT}`);
    });
}

startServer();
