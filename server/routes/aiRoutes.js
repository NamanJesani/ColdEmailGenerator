const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const aiController = require('../controllers/aiController');

// Route for generating email
router.post('/generate-email', protect, aiController.generateEmail);

module.exports = router;