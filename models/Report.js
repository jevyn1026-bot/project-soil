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
    },

    appearedAt: {
        type: Date,
        default: null
    },

    responseTime: {
        type: Number,
        default: null
    }
});

module.exports = mongoose.model("Report", ReportSchema);
