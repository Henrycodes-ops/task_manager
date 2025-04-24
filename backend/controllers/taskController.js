const Task = require("../models/Task");
const Repository = require("../models/repository");
const User = require("../models/user");
const axios = require("axios");

// Get all tasks for the authenticated user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if task belongs to authenticated user
    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this task" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, repository } =
      req.body;

    const newTask = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user.id,
      repository: repository || null,
    });

    const task = await newTask.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    // Find task and check ownership
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    // Update fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await task.remove();
    res.json({ message: "Task removed" });
  } catch (error) {
    console.error("Error deleting task:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Link task to GitHub repository
exports.linkTaskToRepository = async (req, res) => {
  try {
    const { repositoryId } = req.body;

    // Validate repository ID
    if (!repositoryId) {
      return res.status(400).json({ message: "Repository ID is required" });
    }

    // Find task and check ownership
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    // Find repository and check ownership
    const repository = await Repository.findById(repositoryId);

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (repository.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to use this repository" });
    }

    // Update task with repository reference
    task.repository = repositoryId;
    // Clear any previous GitHub issue link
    task.githubIssue = null;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error("Error linking task to repository:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Task or repository not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Link task to GitHub issue
exports.linkTaskToIssue = async (req, res) => {
  try {
    const { repositoryId, issueNumber } = req.body;

    // Validate inputs
    if (!repositoryId || !issueNumber) {
      return res
        .status(400)
        .json({ message: "Repository ID and issue number are required" });
    }

    // Find task and check ownership
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    // Find repository and check ownership
    const repository = await Repository.findById(repositoryId);

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (repository.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to use this repository" });
    }

    // Get GitHub token
    const user = await User.findById(req.user.id);
    if (!user.githubToken) {
      return res.status(401).json({ message: "GitHub token not found" });
    }

    // Fetch issue details from GitHub
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${repository.full_name}/issues/${issueNumber}`,
        {
          headers: { Authorization: `token ${user.githubToken}` },
        }
      );

      // Update task with repository and issue information
      task.repository = repositoryId;
      task.githubIssue = {
        issue_number: response.data.number,
        title: response.data.title,
        html_url: response.data.html_url,
        state: response.data.state,
      };

      const updatedTask = await task.save();
      res.json(updatedTask);
    } catch (githubError) {
      console.error(
        "GitHub API error:",
        githubError.response?.data || githubError.message
      );
      return res
        .status(404)
        .json({ message: "GitHub issue not found or inaccessible" });
    }
  } catch (error) {
    console.error("Error linking task to issue:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Task or repository not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Unlink task from GitHub
exports.unlinkTask = async (req, res) => {
  try {
    // Find task and check ownership
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    // Remove GitHub-related fields
    task.repository = null;
    task.githubIssue = null;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error("Error unlinking task:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Get tasks by repository
exports.getTasksByRepository = async (req, res) => {
  try {
    const { repositoryId } = req.params;

    // Find repository and check ownership
    const repository = await Repository.findById(repositoryId);

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (repository.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this repository" });
    }

    // Find tasks for this repository
    const tasks = await Task.find({
      user: req.user.id,
      repository: repositoryId,
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by repository:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
