const express = require("express");
const router = express.Router();

const detectBarangay = require("../utils/barangayDetector");

router.get("/", (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({
            error: "Missing coordinates"
        });
    }

    const barangay = detectBarangay(
        Number(lat),
        Number(lng)
    );

    res.json({
        barangay
    });
});

module.exports = router;
