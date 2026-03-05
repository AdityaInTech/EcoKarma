const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route: Fetch leaderboard data (GET /api/users/leaderboard)
router.get('/leaderboard', userController.getLeaderboard);

// ADDED THIS ROUTE: Fetch specific user profile
router.get('/:id', userController.getUserProfile);

module.exports = router;