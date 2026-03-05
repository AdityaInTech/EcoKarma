const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route 1: Register a new user
// When the frontend sends a POST request to /api/auth/register, it runs the registerUser function
router.post('/register', authController.registerUser);

// Route 2: Log in a user
// When the frontend sends a POST request to /api/auth/login, it runs the loginUser function
router.post('/login', authController.loginUser);

module.exports = router;