const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route
router.post('/register', authController.registerUser);

// Login route
router.post('/login', authController.loginUser);

//verify otp
router.post('/verify-otp', authController.verifyOtp);
module.exports = router;