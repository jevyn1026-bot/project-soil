const express = require("express");
const router = express.Router();
const { Types } = require("mongoose");
const Report = require("../models/Report");
const detectBarangay = require("../utils/barangayDetector");
const User = require("../models/User");
const auth = require("../middleware/auth");

// Get all reports
router.get("/", async (req, res) => {
    try {

const reports = await Report.find()
    .sort({ timestamp: -1 })
    .limit(100);

for (const report of reports) {

    if (!report.appearedAt) {

        report.appearedAt = new Date();

        report.responseTime =
            report.appearedAt.getTime() -
            new Date(report.timestamp).getTime();

        await report.save();
    }

}

console.log(reports);
res.json(reports);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit a report
router.post("/", auth, async (req, res) => {
    console.log("POST /reports received");

    try {

const detectedBarangay = req.body.barangay;

console.log("Detected barangay:", detectedBarangay);

const report = new Report({
    ...req.body,
    userId: req.user.id,
    barangay: detectedBarangay,
    status: "Pending"
});

await report.save();

// Award points for submitting a report
const user = await User.findById(req.user.id);

if (user) {
    user.points += 0;
    await user.save();
}

res.status(201).json({
    success: true,
    report
});
} catch (err) {
    console.error("POST /reports ERROR:");
    console.error(err);

    res.status(500).json({
        error: err.message
    });
}

});

// Award points only the first time a report is resolved

router.put("/:id", async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ error: "Report not found." });
        }

        if (report.status !== "Resolved" && req.body.status === "Resolved") {

            console.log("=== REPORT RESOLVED ===");
            console.log("Report ID:", report._id);
            console.log("Report userId:", report.userId);

            const user = await User.findById(report.userId);

            console.log("User found:", !!user);

            if (user) {
                console.log("Points before:", user.points);

                user.points += 20;
                user.verifiedReports += 1;

                // Level System
                if (user.points >= 1000) user.level = 6;
                else if (user.points >= 500) user.level = 5;
                else if (user.points >= 300) user.level = 4;
                else if (user.points >= 150) user.level = 3;
                else if (user.points >= 50) user.level = 2;
                else user.level = 1;

                // Badge System
                const reports = user.verifiedReports;

                if (reports >= 1000 && !user.badges.includes("Entity of the Philippines"))
                    user.badges.push("Entity of the Philippines");
                else if (reports >= 500 && !user.badges.includes("Mythical Contributor"))
                    user.badges.push("Mythical Contributor");
                else if (reports >= 300 && !user.badges.includes("Ancient Savior"))
                    user.badges.push("Ancient Savior");
                else if (reports >= 100 && !user.badges.includes("Earth's Right Hand"))
                    user.badges.push("Earth's Right Hand");
                else if (reports >= 50 && !user.badges.includes("Heaven's Helper"))
                    user.badges.push("Heaven's Helper");
                else if (reports >= 25 && !user.badges.includes("Planet Avenger"))
                    user.badges.push("Planet Avenger");
                else if (reports >= 10 && !user.badges.includes("Protector of Earth"))
                    user.badges.push("Protector of Earth");
                else if (reports >= 5 && !user.badges.includes("Mother Nature's Guardian"))
                    user.badges.push("Mother Nature's Guardian");
                else if (reports >= 1 && !user.badges.includes("Earth's New Ally"))
                    user.badges.push("Earth's New Ally");

                console.log("Points after:", user.points);

                await user.save();
            }
        }

        report.status = req.body.status;
        await report.save();

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

// Get reports of the logged-in user
router.get("/my", auth, async (req, res) => {
    try {
        const reports = await Report.find({ userId: req.user.id })
            .sort({ timestamp: -1 });

        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

