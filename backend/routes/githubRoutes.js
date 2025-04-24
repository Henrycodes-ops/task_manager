const express = require("express");
const router = express.Router();
const githubController = require("../controllers/githubController");
const { authenticateToken } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get authenticated GitHub user info
router.get("/user", githubController.getAuthenticatedUser);

// Get user's GitHub repositories
router.get("/repositories", githubController.getUserRepositories);

// Import a GitHub repository
router.post("/repositories/import", githubController.importRepository);

// Get user's imported repositories
router.get("/repositories/imported", githubController.getImportedRepositories);

// Sync a repository with latest GitHub data
router.put("/repositories/:repoId/sync", githubController.syncRepository);

// Remove an imported repository
router.delete("/repositories/:repoId", githubController.removeRepository);

module.exports = router;
