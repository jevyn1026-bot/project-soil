const fs = require("fs");
const path = require("path");
const turf = require("@turf/turf");

const barangays = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "../data/pasig_barangays.geojson"),
        "utf8"
    )
);

function detectBarangay(latitude, longitude) {
    const point = turf.point([
        longitude,
        latitude
    ]);

    for (const barangay of barangays.features) {
        if (turf.booleanPointInPolygon(point, barangay)) {
return barangay.properties.BARANGAY;
        }
    }

    return "Unknown";
}

module.exports = detectBarangay;
