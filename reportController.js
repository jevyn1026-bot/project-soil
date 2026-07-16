const { db } = require("../database");

async function createReport(req, res) {
  const report = {
    id: Date.now(),
    location: req.body.location,
    description: req.body.description,
    image: req.body.image || null,
    status: "Pending"
  };

  db.data.reports.push(report);
  await db.write();

  res.json({
    message: "Report submitted successfully",
    report
  });
}

async function getReports(req, res) {
  await db.read();

  res.json(db.data.reports);
}

module.exports = {
  createReport,
  getReports
};



