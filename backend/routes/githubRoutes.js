const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const githubController = require('../controllers/githubController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get user's GitHub repositories
router.get('/repos', githubController.getRepos);

// Get branches for a specific repository
router.get('/branches/:repo', githubController.getBranches);

module.exports = router; 