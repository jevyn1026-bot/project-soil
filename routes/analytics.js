const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

router.get("/summary", async (req, res) => {
    try {
        const reports = await Report.find();

        const barangays = {};

        reports.forEach(report => {
            if (report.barangay) {
                barangays[report.barangay] =
                    (barangays[report.barangay] || 0) + 1;
            }
        });

        const totalReports = reports.length;

        const pollutionReports = reports.filter(r =>
            r.type && r.type !== "Hazard"
        ).length;

        const hazardReports = reports.filter(r =>
            r.type === "Hazard"
        ).length;

        const resolvedReports = reports.filter(r =>
            r.status === "Resolved"
        ).length;

        const pendingReports = reports.filter(r =>
            r.status !== "Resolved"
        ).length;

        res.json({
            totalReports,
            pollutionReports,
            hazardReports,
            resolvedReports,
            pendingReports,
            barangays
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;
