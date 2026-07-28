const express = require("express");
const router = express.Router();
const { db } = require("../database");

// GET all reports
router.get("/", async (req, res) => {
    try {
        const reports = await db.find({}).toArray();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE report
router.post("/", async (req, res) => {
    try {
        const report = {
            barangay: req.body.barangay || "",
            type: req.body.type,
            description: req.body.description,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            photo: req.body.photo || "",
            status: "Pending",
            timestamp: new Date()
        };

        const result = await db.insertOne(report);

        res.status(201).json({
            _id: result.insertedId,
            ...report
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE report status
router.put("/:id", async (req, res) => {
    try {
        const { ObjectId } = require("mongodb");

        await db.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { status: req.body.status } }
        );

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE report
router.delete("/:id", async (req, res) => {
    try {
        const { ObjectId } = require("mongodb");

        await db.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
