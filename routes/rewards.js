const express = require("express");
const router = express.Router();

const Reward = require("../models/Reward");
const User = require("../models/User");
const auth = require("../middleware/auth");


// Get all available rewards
router.get("/", async (req, res) => {
    try {

        const rewards = await Reward.find({
            available: true
        });

        res.json(rewards);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});


// Claim reward
router.post("/claim/:id", auth, async (req, res) => {

    try {

        const reward = await Reward.findById(req.params.id);

        if (!reward) {
            return res.status(404).json({
                error: "Reward not found"
            });
        }


        const user = await User.findById(req.user.id);


        if (user.points < reward.cost) {

            return res.status(400).json({
                error: "Not enough Eco Points"
            });

        }


user.points -= reward.cost;

// Theme reward
if (reward.type === "theme") {

    if (user.unlockedThemes.includes(reward.name)) {
        return res.status(400).json({
            error: "Theme already unlocked."
        });
    }

    user.unlockedThemes.push(reward.name);
}

// Frame reward
else if (reward.type === "frame") {

    if (user.unlockedFrames.includes(reward.name)) {
        return res.status(400).json({
            error: "Frame already unlocked."
        });
    }

    user.unlockedFrames.push(reward.name);
}

// Banner reward
else if (reward.type === "banner") {

    if (user.unlockedBanners.includes(reward.name)) {
        return res.status(400).json({
            error: "Banner already unlocked."
        });
    }

    user.unlockedBanners.push(reward.name);
}

await user.save();

        res.json({
            success:true,
            message:"Reward claimed!",
            remainingPoints:user.points
        });


    } catch(err){

        res.status(500).json({
            error:err.message
        });

    }

});

router.put("/theme/:name", auth, async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user.unlockedThemes.includes(req.params.name)) {

            return res.status(400).json({
                error: "Theme not unlocked."
            });

        }

        user.selectedTheme = req.params.name;

        await user.save();

        res.json({
            success: true,
            theme: user.selectedTheme
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

module.exports = router;

