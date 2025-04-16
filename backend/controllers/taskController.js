const Task = require("../models/task");

// Get all tasks for the authenticated user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tasks",
    });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      githubRepo,
      githubBranch,
    } = req.body;

    // Basic validation
    if (!title) {
      return res.status(400).json({
        success: false,
        error: "Title is required",
      });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      githubRepo,
      githubBranch,
      userId: req.user.id,
    });

    await task.save();

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create task",
    });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { taskId, ...updates } = req.body;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: "Task ID is required",
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.user.id },
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update task",
    });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete task",
    });
  }
};
