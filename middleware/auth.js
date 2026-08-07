const jwt = require("jsonwebtoken");

function auth(req, res, next) {

    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    try {

        const actualToken = token.startsWith("Bearer ")
            ? token.slice(7)
            : token;

        const decoded = jwt.verify(
            actualToken,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        res.status(400).json({
            message: "Invalid token."
        });

    }
}

module.exports = auth;
