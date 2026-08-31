async function loadStatistics() {

    try {

        const response = await fetch("/api/analytics/summary");

if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
} 

       const stats = await response.json();

        document.getElementById("totalReports").textContent = stats.totalReports;
        document.getElementById("pollutionReports").textContent = stats.pollutionReports;
        document.getElementById("resolvedReports").textContent = stats.resolvedReports;
        document.getElementById("pendingReports").textContent = stats.pendingReports;

        const ctx = document.getElementById("summaryChart").getContext("2d");

        new Chart(ctx, {

            type: "bar",

            data: {

                labels: [
                    "Pollution",
                    "Resolved",
                    "Pending"
                ],

                datasets: [{

                    label: "Number of Reports",

                    data: [

                        stats.pollutionReports,
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

async function loadReports() {
    try {
        const response = await fetch("/reports");
        const reports = await response.json();

        const table = document.getElementById("reportsTable");
        table.innerHTML = "";

        reports.forEach(report => {
            table.innerHTML += `
                <tr>
                    <td>${report.barangay || "Unknown"}</td>
                    <td>${report.type}</td>
                    <td>${report.status}</td>
                    <td>${new Date(report.timestamp).toLocaleString()}</td>
                </tr>
            `;
        });

    } catch (err) {
        console.error("Report Error:", err);
    }
}

loadReports();
