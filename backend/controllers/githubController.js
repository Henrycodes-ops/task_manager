const axios = require("axios");
const Repository = require("../models/repository");
const User = require("../models/user");

exports.getAuthenticatedUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.githubToken) {
      return res
        .status(401)
        .json({
          message:
            "GitHub token not found. Please connect your GitHub account.",
        });
    }

    const response = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${user.githubToken}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "GitHub authentication error:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({
        message: "Error fetching GitHub user data",
        error: error.response?.data || error.message,
      });
  }
};

exports.getUserRepositories = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.githubToken) {
      return res
        .status(401)
        .json({
          message:
            "GitHub token not found. Please connect your GitHub account.",
        });
    }

    const response = await axios.get(
      "https://api.github.com/user/repos?sort=updated&per_page=100",
      {
        headers: {
          Authorization: `token ${user.githubToken}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching repositories:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({
        message: "Error fetching repositories",
        error: error.response?.data || error.message,
      });
  }
};

exports.importRepository = async (req, res) => {
  try {
    const { repoId } = req.body;
    if (!repoId) {
      return res.status(400).json({ message: "Repository ID is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.githubToken) {
      return res
        .status(401)
        .json({
          message:
            "GitHub token not found. Please connect your GitHub account.",
        });
    }

    // Get repository details from GitHub
    const response = await axios.get(
      `https://api.github.com/repositories/${repoId}`,
      {
        headers: {
          Authorization: `token ${user.githubToken}`,
        },
      }
    );

    const repoData = response.data;

    // Check if repository is already imported
    let repository = await Repository.findOne({
      full_name: repoData.full_name,
      user: user._id,
    });

    if (repository) {
      // Update existing repository
      repository.description = repoData.description;
      repository.stars = repoData.stargazers_count;
      repository.forks = repoData.forks_count;
      repository.open_issues = repoData.open_issues_count;
      repository.last_synced = new Date();
      await repository.save();
    } else {
      // Create new repository record
      repository = new Repository({
        name: repoData.name,
        owner: repoData.owner.login,
        full_name: repoData.full_name,
        description: repoData.description,
        url: repoData.url,
        html_url: repoData.html_url,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        open_issues: repoData.open_issues_count,
        user: user._id,
      });
      await repository.save();
    }

    res.json(repository);
  } catch (error) {
    console.error(
      "Error importing repository:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({
        message: "Error importing repository",
        error: error.response?.data || error.message,
      });
  }
};

exports.getImportedRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find({ user: req.user.id });
    res.json(repositories);
  } catch (error) {
    console.error("Error fetching imported repositories:", error.message);
    res
      .status(500)
      .json({
        message: "Error fetching imported repositories",
        error: error.message,
      });
  }
};

exports.syncRepository = async (req, res) => {
  try {
    const { repoId } = req.params;

    const repository = await Repository.findById(repoId);
    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (repository.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this repository" });
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.githubToken) {
      return res.status(401).json({ message: "GitHub token not found" });
    }

    const response = await axios.get(
      `https://api.github.com/repos/${repository.full_name}`,
      {
        headers: { Authorization: `token ${user.githubToken}` },
      }
    );

    const repoData = response.data;

    repository.description = repoData.description;
    repository.stars = repoData.stargazers_count;
    repository.forks = repoData.forks_count;
    repository.open_issues = repoData.open_issues_count;
    repository.last_synced = new Date();

    await repository.save();

    res.json(repository);
  } catch (error) {
    console.error(
      "Error syncing repository:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({
        message: "Error syncing repository",
        error: error.response?.data || error.message,
      });
  }
};

exports.removeRepository = async (req, res) => {
  try {
    const { repoId } = req.params;

    const repository = await Repository.findById(repoId);
    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (repository.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to remove this repository" });
    }

    await Repository.findByIdAndDelete(repoId);

    res.json({ message: "Repository removed successfully" });
  } catch (error) {
    console.error("Error removing repository:", error.message);
    res
      .status(500)
      .json({ message: "Error removing repository", error: error.message });
  }
};
