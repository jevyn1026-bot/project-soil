const { mongoose } = require("../database");

const ReportSchema = new mongoose.Schema({
    barangay: String,
    type: String,
    description: String,
    latitude: Number,
    longitude: Number,
    photo: String,
    status: {
        type: String,
        default: "Pending"
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Report", ReportSchema);
