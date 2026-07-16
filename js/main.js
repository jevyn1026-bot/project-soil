/**
 * ====================================================================
 * ECOPASIG CENTRAL MAP & REPORTING ENGINE (PHASES 2, 4, & 5)
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- MAIN MENU MOBILE TOGGLE FIX ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    // ------------------------------------

    // Phase 2 & 5: Main Dashboard Map Screen
    if (document.getElementById('pollution-map')) {
        initPasigMainMap();
    }
    
    // Phase 4: Soil Pollution Form Screen
    if (document.getElementById('pollution-report-form')) {
        initReportingEngine('pollution-report-form', 'eco_reports', 'report-');
    }
    
    // Phase 5: Disaster Hazard Form Screen
    if (document.getElementById('hazard-report-form')) {
        initReportingEngine('hazard-report-form', 'eco_hazards', 'hazard-');
    }
});

/**
 * ====================================================================
 * PHASES 2 & 5: RESTRICTED INTERACTIVE MAIN MAP WITH STREET MAP & HAZARD ZONES
 * ====================================================================
 */
function initPasigMainMap() {
    const pasigSouthWest = L.latLng(14.5300, 121.0500);
    const pasigNorthEast = L.latLng(14.6100, 121.1200);
    const pasigBounds = L.latLngBounds(pasigSouthWest, pasigNorthEast);

    // Initialize map without a default layer attached directly to base map
    const map = L.map('pollution-map', {
        center: [14.5594, 121.0805], 
        zoom: 14,
        minZoom: 13,
        maxBounds: pasigBounds,
        maxBoundsViscosity: 1.0 
    });

    // 1. STREET MAP AND SATELLITE TILES
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
    const streetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    });

    // Default to Street Map View for easier navigation
    streetMapLayer.addTo(map);

    // 2. EMBEDDED DANGER/HAZARD PLACES (Baseline High-Risk Zones)
    const hazardZonesLayer = L.layerGroup();

    // Flood Zone 1: Manggahan Floodway Corridor
    L.polygon([
        [14.5780, 121.0950],
        [14.5820, 121.1020],
        [14.5550, 121.1150],
