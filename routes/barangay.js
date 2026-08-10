const express = require("express");
const router = express.Router();

const detectBarangay =
    require("../utils/barangayDetector");


router.get("/", (req, res) => {

    const lat =
        Number(req.query.lat);

    const lng =
        Number(req.query.lng);


    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
    ) {

        return res.status(400).json({
            error: "Missing or invalid coordinates",
            barangay: ""
        });
    }


    const barangay =
        detectBarangay(
            lat,
            lng
        );


    console.log(
        "📍 Barangay lookup:",
        {
            latitude: lat,
            longitude: lng,
            barangay: barangay || "Not resolved"
        }
    );


    /*
     * Always return the GPS coordinates too.
     *
     * This is important because even if the barangay
     * boundary lookup fails, the actual location is not lost.
     */

    res.json({
        barangay: barangay || "",
        latitude: lat,
        longitude: lng
    });

});


module.exports = router;
