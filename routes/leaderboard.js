const express = require("express");
const router = express.Router();

console.log("Leaderboard route loaded");

const User = require("../models/User");

router.get("/", async (req, res) => {
    try {
        const users = await User.find()
            .sort({ points: -1, verifiedReports: -1 })
            .select("fullName points level verifiedReports badges");

        res.json(users);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;
