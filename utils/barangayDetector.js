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
    const point = turf.point([longitude, latitude]);

    // 1. Exact polygon detection
    for (const barangay of barangays.features) {
        if (turf.booleanPointInPolygon(point, barangay)) {
            console.log(
                `📍 GPS ${latitude}, ${longitude} → Barangay ${barangay.properties.ADM4_EN}`
            );

            return barangay.properties.ADM4_EN;
        }
    }

    // 2. Small GPS/boundary tolerance
    let nearest = null;

    for (const barangay of barangays.features) {
        try {
            const boundary = turf.polygonToLine(barangay);

            const closest = turf.nearestPointOnLine(
                boundary,
                point,
                { units: "kilometers" }
            );

            const distance = closest.properties.dist;

            if (!nearest || distance < nearest.distance) {
                nearest = {
                    name: barangay.properties.ADM4_EN,
                    distance
                };
            }
        } catch (err) {
            // Ignore invalid geometries
        }
    }

    // 50-meter maximum tolerance
    if (nearest && nearest.distance <= 0.05) {
        console.log(
            `📍 GPS ${latitude}, ${longitude} → Barangay ${nearest.name} ` +
            `(boundary tolerance: ${(nearest.distance * 1000).toFixed(2)} m)`
        );

        return nearest.name;
    }

    console.log(
        `⚠️ No barangay polygon matched GPS ${latitude}, ${longitude}`
    );

    if (nearest) {
        console.log(
            `Nearest boundary: ${nearest.name} ` +
            `(${(nearest.distance * 1000).toFixed(2)} m)`
        );
    }

    return "Unknown";
}

module.exports = detectBarangay;
