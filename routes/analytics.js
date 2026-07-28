const express = require("express");
const router = express.Router();
const { db } = require("../database");

router.get("/summary", async (req, res) => {
    try {
        const reports = await db.find({}).toArray();

        const barangays = {};

        reports.forEach(report => {
            if (report.barangay) {
                barangays[report.barangay] =
                    (barangays[report.barangay] || 0) + 1;
            }
        });

        res.json({
            totalReports: reports.length,
            pollutionReports: reports.filter(r => r.type && r.type !== "Hazard").length,
            hazardReports: reports.filter(r => r.type === "Hazard").length,
            resolvedReports: reports.filter(r => r.status === "Resolved").length,
            pendingReports: reports.filter(r => r.status !== "Resolved").length,
            barangays
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;
