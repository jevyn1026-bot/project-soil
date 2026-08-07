const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {

    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({
            error: "Missing coordinates"
        });
    }

    try {

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
            {
                headers: {
                    "User-Agent": "ProjectSUN/1.0"
                }
            }
        );

const data = await response.json();

console.log(data.address);

const address = data.address || {};

        const barangay =
            address.suburb ||
            address.village ||
            address.neighbourhood ||
            address.quarter ||
            "Unknown";

        res.json({
            barangay
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            barangay: "Unknown"
        });

    }

});

module.exports = router;
