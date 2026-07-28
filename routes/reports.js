const express = require("express");
const router = express.Router();
const { Types } = require("mongoose");
const Report = require("../models/Report");

// Get all reports
router.get("/", async (req, res) => {
    try {
        const reports = await Report.find().sort({ timestamp: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit a report
router.post("/", async (req, res) => {
    try {
        const report = new Report(req.body);
        report.status = "Pending";

        await report.save();

        res.status(201).json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update report status
router.put("/:id", async (req, res) => {
    try {
        await Report.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status }
        );

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete report
router.delete("/:id", async (req, res) => {
    try {
        await Report.findByIdAndDelete(req.params.id);

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
