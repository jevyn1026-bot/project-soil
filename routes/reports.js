const express = require("express");
const router = express.Router();
const { db } = require("../database");

// ===========================
// GET ALL REPORTS
// ===========================
router.get("/", async (req, res) => {

    try {

        const reports = await db.find({});

        res.json(reports);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// ===========================
// CREATE REPORT
// ===========================
router.post("/", async (req, res) => {

    try {

        const report = {

            type: req.body.type,
            description: req.body.description,
            barangay: req.body.barangay || "",
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            photo: req.body.photo || "",
            status: "Pending",
            timestamp: new Date()

        };

        const saved = await db.insert(report);

        res.status(201).json(saved);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// ===========================
// UPDATE REPORT STATUS
// ===========================
router.put("/:id", async (req, res) => {

    try {

        const report = await db.findOne({
            _id: req.params.id
        });

        if (!report) {

            return res.status(404).json({
                error: "Report not found"
            });

        }

        report.status = req.body.status;

        await db.update(
            { _id: req.params.id },
            report
        );

        res.json({
            success: true,
            report
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// ===========================
// DELETE REPORT
// ===========================
router.delete("/:id", async (req, res) => {

    try {

        await db.remove({
            _id: req.params.id
        });

        res.json({
            success: true
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

module.exports = router;
