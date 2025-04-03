const Task = require('../models/Task');

// Get all tasks for the authenticated user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({
      success: false,
      error: 'Error fetching tasks',
      message: error.message
    });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, status, githubRepo } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    const task = new Task({
      userId: req.user.id,
      title,
      description,
      priority: priority || 'medium',
      dueDate,
      status: status || 'pending',
      githubRepo,
    });

    const savedTask = await task.save();
    return res.status(201).json({
      success: true,
      data: savedTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({
      success: false,
      error: 'Error creating task',
      message: error.message
    });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { taskId, title, description, priority, dueDate, status } = req.body;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.user.id },
      { 
        title,
        description,
        priority,
        dueDate,
        status,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({
      success: false,
      error: 'Error updating task',
      message: error.message
    });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }

    const task = await Task.findOneAndDelete({
      _id: taskId,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: { id: taskId }
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({
      success: false,
      error: 'Error deleting task',
      message: error.message
    });
  }
}; 