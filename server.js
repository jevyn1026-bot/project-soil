const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./database');
const reportRoutes = require('./routes/reports');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve layout styling assets from the current active folder path directory
app.use(express.static(__dirname));

connectDB();

// Explicit mapping routing system rules
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Soil.html'));
});

app.get('/Soil.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Soil.html'));
});

app.get('/report.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'report.html'));
});

app.get('/map.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'map.html'));
});

app.get('/admin-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// MongoDB APIs Connection Routes
app.use('/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get("/reset-database", async (req, res) => {
    try {
        const { db } = require("./database");
        await db.remove({}, { multi: true });

        res.send("✅ Database reset successfully.");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Project Sun server perfectly connected on port ${PORT}`);
});
