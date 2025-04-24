const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { authenticateToken } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all tasks for the authenticated user
router.get("/", taskController.getTasks);

// Get a single task by ID
router.get("/:id", taskController.getTaskById);

// Create a new task
router.post("/", taskController.createTask);

// Update a task
router.put("/:id", taskController.updateTask);

// Delete a task
router.delete("/:id", taskController.deleteTask);

// Link task to GitHub repository
router.put("/:id/link-repository", taskController.linkTaskToRepository);

// Link task to GitHub issue
router.put("/:id/link-issue", taskController.linkTaskToIssue);

// Unlink task from GitHub
router.put("/:id/unlink", taskController.unlinkTask);

// Get tasks by repository
router.get("/repository/:repositoryId", taskController.getTasksByRepository);

module.exports = router;
