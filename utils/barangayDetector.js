const fs = require("fs");
const path = require("path");
const turf = require("@turf/turf");

/*
 * ============================================================
 * PROJECTSUN - UNIVERSAL PASIG BARANGAY DETECTOR
 * ============================================================
 *
 * GPS coordinates are the source of truth.
 *
 * This detector:
 * 1. Loads all barangays from the GeoJSON file.
 * 2. Supports different barangay property names.
 * 3. Supports Polygon and MultiPolygon boundaries.
 * 4. Handles GPS points very close to a barangay boundary.
 * 5. Never crashes because a GeoJSON property is missing.
 */

const geoJsonPath = path.join(
    __dirname,
    "../data/pasig_barangays.geojson"
);

let barangays;

try {
    const file = fs.readFileSync(
        geoJsonPath,
        "utf8"
    );

    const parsed = JSON.parse(file);

    if (parsed.type === "FeatureCollection") {
        barangays = parsed.features || [];
    } else if (parsed.type === "Feature") {
        barangays = [parsed];
    } else {
        throw new Error(
            "GeoJSON must be a FeatureCollection or Feature."
        );
    }

    console.log(
        `✅ Loaded ${barangays.length} barangay boundaries.`
    );

} catch (error) {

    console.error(
        "❌ Failed to load Pasig barangay GeoJSON:",
        error.message
    );

    barangays = [];
}


/*
 * ------------------------------------------------------------
 * GET BARANGAY NAME
 * ------------------------------------------------------------
 *
 * Different GeoJSON files use different property names.
 * We check several common formats.
 */

function getBarangayName(feature) {

    const properties =
        feature?.properties || {};

    const possibleNames = [
        properties.ADM4_EN,
        properties.adm4_en,
        properties.BRGY_NAME,
        properties.BARANGAY,
        properties.barangay,
        properties.Barangay,
        properties.NAME_4,
        properties.NAME,
        properties.name,
        properties.VILLAGE,
        properties.village
    ];

    for (const value of possibleNames) {

        if (
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        ) {

            return normalizeBarangayName(value);
        }
    }

    return "";
}


/*
 * ------------------------------------------------------------
 * NORMALIZE NAME
 * ------------------------------------------------------------
 */

function normalizeBarangayName(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    let name =
        String(value).trim();

    if (!name) {
        return "";
    }

    /*
     * Remove prefixes.
     *
     * Example:
     * Barangay Rosario -> Rosario
     * Brgy. Rosario    -> Rosario
     */
    name = name.replace(
        /^(barangay|brgy\.?|bgy\.?)\s+/i,
        ""
    );

    /*
     * Remove repeated spaces.
     */
    name = name.replace(
        /\s+/g,
        " "
    );

    /*
     * Consistent capitalization.
     */
    name = name
        .toLowerCase()
        .split(" ")
        .map(word => {

            if (!word) {
                return word;
            }

            return (
                word.charAt(0).toUpperCase() +
                word.slice(1)
            );

        })
        .join(" ");

    return name;
}


/*
 * ------------------------------------------------------------
 * DETECT BARANGAY
 * ------------------------------------------------------------
 */

function detectBarangay(
    latitude,
    longitude
) {

    const lat =
        Number(latitude);

    const lng =
        Number(longitude);


    /*
     * Validate coordinates.
     */

    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
    ) {

        console.warn(
            "⚠️ Invalid GPS coordinates:",
            latitude,
            longitude
        );

        return "";
    }


    /*
     * Validate geographic ranges.
     */

    if (
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
    ) {

        console.warn(
            "⚠️ GPS coordinates outside valid range:",
            lat,
            lng
        );

        return "";
    }


    /*
     * IMPORTANT:
     *
     * GeoJSON uses:
     *
     * [longitude, latitude]
     *
     * NOT:
     *
     * [latitude, longitude]
     */

    const point =
        turf.point([
            lng,
            lat
        ]);


    /*
     * --------------------------------------------------------
     * FIRST PASS
     * Exact polygon detection.
     * --------------------------------------------------------
     */

    for (const feature of barangays) {

        if (
            !feature ||
            !feature.geometry
        ) {
            continue;
        }

        try {

            const inside =
                turf.booleanPointInPolygon(
                    point,
                    feature
                );

            if (inside) {

                const name =
                    getBarangayName(feature);

                if (name) {

                    console.log(
                        `📍 GPS ${lat}, ${lng} → Barangay ${name}`
                    );

                    return name;
                }
            }

        } catch (error) {

            console.warn(
                "⚠️ Invalid barangay geometry:",
                error.message
            );
        }
    }


    /*
     * --------------------------------------------------------
     * SECOND PASS
     *
     * GPS devices can report a position a few meters outside
     * the mapped boundary.
     *
     * We therefore check a small 20-meter buffer around each
     * barangay boundary.
     *
     * This helps phones with normal GPS accuracy near borders.
     * --------------------------------------------------------
     */

    try {

        const tolerance =
            20 / 1000;

        for (const feature of barangays) {

            if (
                !feature ||
                !feature.geometry
            ) {
                continue;
            }

            try {

                const buffered =
                    turf.buffer(
                        feature,
                        tolerance,
                        {
                            units: "kilometers"
                        }
                    );

                if (
                    buffered &&
                    turf.booleanPointInPolygon(
                        point,
                        buffered
                    )
                ) {

                    const name =
                        getBarangayName(feature);

                    if (name) {

                        console.log(
                            `📍 GPS ${lat}, ${lng} → Barangay ${name} (boundary tolerance)`
                        );

                        return name;
                    }
                }

            } catch (error) {

                console.warn(
                    "⚠️ Could not process barangay boundary:",
                    error.message
                );
            }
        }

    } catch (error) {

        console.warn(
            "⚠️ Boundary tolerance failed:",
            error.message
        );
    }


    /*
     * --------------------------------------------------------
     * NO MATCH
     * --------------------------------------------------------
     *
     * IMPORTANT:
     *
     * We return an empty string instead of "Unknown".
     *
     * The GPS coordinates are still valid and the report
     * should retain them.
     */

    console.warn(
        `⚠️ No barangay polygon matched GPS ${lat}, ${lng}`
    );

    return "";
}


module.exports = detectBarangay;
