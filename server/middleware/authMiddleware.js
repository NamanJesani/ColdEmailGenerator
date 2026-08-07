const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("AUTH HEADER:", authHeader);

        if (!authHeader) {
            return res.status(401).json({
                message: 'No Authorization header'
            });
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Authorization header must use Bearer token'
            });
        }

        const token = authHeader.split(' ')[1];

        console.log("TOKEN:", token);

        if (!token) {
            return res.status(401).json({
                message: 'No token provided'
            });
        }

        console.log("JWT SECRET EXISTS:", !!process.env.JWT_SECRET);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("DECODED TOKEN:", decoded);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: 'User associated with token not found'
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.error("AUTH ERROR:", error);

        return res.status(401).json({
            message: 'Invalid token',
            error: error.message
        });
    }
};

module.exports = protect;