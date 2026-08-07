const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: "user"
    },

    points: {
        type: Number,
        default: 0
    },

    level: {
        type: Number,
        default: 1
    },

    badges: {
        type: [String],
        default: []
    },

streak: {
    type: Number,
    default: 0
},

lastLogin: {
    type: Date,
    default: null
},

rewardsRedeemed: {
    type: Number,
    default: 0
},

theme: {
    type: String,
    default: "Forest Theme"
},

frame: {
    type: String,
    default: "Default"
},

    verifiedReports: {
        type: Number,
        default: 0
    },

rewards: {
    type: [String],
    default: []
},

    createdAt: {
        type: Date,
        default: Date.now
    },

unlockedThemes: {
    type: [String],
    default: ["Forest Theme"]
},

selectedTheme: {
    type: String,
    default: "Forest Theme"
},

unlockedFrames: {
    type: [String],
    default: ["Default"]
},

selectedFrame: {
    type: String,
    default: "Default"
},

unlockedBanners: {
    type: [String],
    default: ["Nature"]
},

selectedBanner: {
    type: String,
    default: "Nature"
},

});

module.exports = mongoose.model("User", userSchema);
