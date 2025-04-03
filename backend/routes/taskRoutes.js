const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const taskController = require('../controllers/taskController');

// Apply auth middleware to all task routes
router.use(authMiddleware);

// Get all tasks for the authenticated user
router.get('/', taskController.getTasks);

// Create a new task
router.post('/', taskController.createTask);

// Update a task
router.put('/', taskController.updateTask);

// Delete a task
router.delete('/:taskId', taskController.deleteTask);

module.exports = router; 