const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/dashboard", auth, async (req, res) => {

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admins only."
        });
    }

    res.json({
        message: "Welcome admin",
        user: req.user
    });

});

module.exports = router;
