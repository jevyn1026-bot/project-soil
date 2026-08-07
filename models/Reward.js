const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    cost: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        default: "Personal"
    },

    icon: {
        type: String,
        default: "🎁"
    },

    available: {
        type: Boolean,
        default: true
    }

});

module.exports = mongoose.model("Reward", rewardSchema);
