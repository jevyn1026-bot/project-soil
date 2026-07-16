async function loadStatistics() {

    try {

        const response = await fetch("/api/analytics/summary");

if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
} 

       const stats = await response.json();

        document.getElementById("totalReports").textContent = stats.totalReports;
        document.getElementById("pollutionReports").textContent = stats.pollutionReports;
        document.getElementById("hazardReports").textContent = stats.hazardReports;
        document.getElementById("resolvedReports").textContent = stats.resolvedReports;
        document.getElementById("pendingReports").textContent = stats.pendingReports;

        const ctx = document.getElementById("summaryChart").getContext("2d");

        new Chart(ctx, {

            type: "bar",

            data: {

                labels: [
                    "Pollution",
                    "Hazard",
                    "Resolved",
                    "Pending"
                ],

                datasets: [{

                    label: "Number of Reports",

                    data: [

                        stats.pollutionReports,
                        stats.hazardReports,
                        stats.resolvedReports,
                        stats.pendingReports

                    ]

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        });
const barangayCtx =
document.getElementById("barangayChart").getContext("2d");

new Chart(barangayCtx,{

    type:"pie",

    data:{

        labels:Object.keys(stats.barangays),

        datasets:[{

            label:"Reports per Barangay",

            data:Object.values(stats.barangays)

        }]

    },

    options:{

        responsive:true,

        plugins:{

            title:{

                display:true,

                text:"Reports per Barangay"

            }

        }

    }

});

    } catch(err) {

    console.error("Analytics Error:", err);
    alert(err.message);

}

}

loadStatistics();
