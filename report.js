const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET all reports
router.get('/', async (req, res) => {
    try {
        const reports = await db.find({});
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new report
router.post('/', async (req, res) => {

    try {

        const report = {
            id: Date.now(),
            type: req.body.type,
            description: req.body.description,
            photo: req.body.photo,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            date: req.body.date || new Date().toLocaleDateString()
        };

        const savedReport = await db.insert(report);

        res.status(201).json(savedReport);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }

});

module.exports = router;const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET all submitted report entries
router.get('/', async (req, res) => {
    try {
        const reports = await db.find({});
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new report entry
router.post('/', async (req, res) => {
    try {
        const newReport = {
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            timestamp: new Date()
        };
        const savedReport = await db.insert(newReport);
        res.status(201).json(savedReport);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
