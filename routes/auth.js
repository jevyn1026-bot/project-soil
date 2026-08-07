const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            fullName,
            email,
            password: hashedPassword
        });

        await user.save();

res.status(201).json({
    success: true
});

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

if (!user) {
    return res.status(404).json({
        message: "No account found. Please register first."
    });
}

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

if (!validPassword) {
    return res.status(401).json({
        message: "Incorrect password."
    });
}

const token = jwt.sign(
    {
        id: user._id,
        role: user.role
    },
    process.env.JWT_SECRET || "projectsoilsecret",
    {
        expiresIn: "7d"
    }
);
        res.json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                points: user.points,
                level: user.level,
                badges: user.badges
            }
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");

        res.json(user);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;
