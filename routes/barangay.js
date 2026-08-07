const express = require("express");
const router = express.Router();
const detectBarangay = require("../utils/barangayDetector");

router.get("/", (req, res) => {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({
            error: "Missing or invalid coordinates"
        });
    }

    const barangay = detectBarangay(lat, lng);

    console.log("Latitude:", lat);
    console.log("Longitude:", lng);
    console.log("Detected:", barangay);

    res.json({ barangay });
});

module.exports = router;
