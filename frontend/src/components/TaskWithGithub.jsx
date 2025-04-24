import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaGithub, FaExternalLinkAlt, FaLink, FaUnlink } from "react-icons/fa";

const TaskWithGitHub = ({ task, onTaskUpdate }) => {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [error, setError] = useState(null);
  const [showLinkForm, setShowLinkForm] = useState(false);

  useEffect(() => {
    if (task.repository) {
      fetchRepositoryDetails(task.repository);
    }
    fetchRepositories();
  }, [task]);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/github/repositories/imported");
      setRepositories(response.data);
    } catch (err) {
      setError("Failed to fetch repositories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRepositoryDetails = async (repoId) => {
    try {
      const response = await axios.get(`/api/github/repositories/${repoId}`);
      setSelectedRepo(response.data);
    } catch (err) {
      console.error("Failed to fetch repository details:", err);
    }
  };

  const fetchRepositoryIssues = async (repoId) => {
    try {
      setLoadingIssues(true);
      const response = await axios.get(
        `/api/github/repositories/${repoId}/issues`
      );
      setIssues(response.data);
    } catch (err) {
      setError("Failed to fetch issues");
      console.error(err);
    } finally {
      setLoadingIssues(false);
    }
  };

  const handleRepositorySelect = async (e) => {
    const repoId = e.target.value;
    if (repoId) {
      setSelectedRepo(repositories.find((repo) => repo._id === repoId));
      fetchRepositoryIssues(repoId);
    } else {
      setSelectedRepo(null);
      setIssues([]);
    }
  };

  const linkTaskToRepo = async () => {
    if (!selectedRepo) return;

    try {
      const response = await axios.put(
        `/api/tasks/${task._id}/link-repository`,
        {
          repositoryId: selectedRepo._id,
        }
      );

      onTaskUpdate(response.data);
      setShowLinkForm(false);
    } catch (err) {
      setError("Failed to link task to repository");
      console.error(err);
    }
  };

  const linkTaskToIssue = async (issueNumber) => {
    try {
      const response = await axios.put(`/api/tasks/${task._id}/link-issue`, {
        repositoryId: selectedRepo._id,
        issueNumber,
      });

      onTaskUpdate(response.data);
      setShowLinkForm(false);
    } catch (err) {
      setError("Failed to link task to issue");
      console.error(err);
    }
  };

  const unlinkTask = async () => {
    try {
      const response = await axios.put(`/api/tasks/${task._id}/unlink`);
      onTaskUpdate(response.data);
    } catch (err) {
      setError("Failed to unlink task");
      console.error(err);
    }
  };

  // Render linked GitHub content
  if (task.repository && task.githubIssue) {
    return (
      <div className="mt-3 border-t pt-3">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <FaGithub className="mr-1" />
          <span>Linked to GitHub Issue</span>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <a
                href={task.githubIssue.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                {task.githubIssue.title ||
                  `Issue #${task.githubIssue.issue_number}`}
                <FaExternalLinkAlt className="ml-1 text-xs" />
              </a>

              <div className="text-xs text-gray-500 mt-1">
                Status:{" "}
                <span
                  className={`font-medium ${
                    task.githubIssue.state === "open"
                      ? "text-green-600"
                      : "text-purple-600"
                  }`}
                >
                  {task.githubIssue.state === "open" ? "Open" : "Closed"}
                </span>
              </div>
            </div>

            <button
              onClick={unlinkTask}
              className="text-xs text-gray-500 hover:text-red-500 flex items-center"
              title="Unlink from GitHub"
            >
              <FaUnlink className="mr-1" /> Unlink
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render linked repository without issue
  if (task.repository && !task.githubIssue) {
    return (
      <div className="mt-3 border-t pt-3">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <FaGithub className="mr-1" />
          <span>Linked to GitHub Repository</span>
        </div>

        <div className="bg-gray-50 p-3 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              {selectedRepo ? (
                <a
                  href={selectedRepo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  {selectedRepo.full_name}
                  <FaExternalLinkAlt className="ml-1 text-xs" />
                </a>
              ) : (
                <span>Loading repository details...</span>
              )}
            </div>

            <div className="flex">
              <button
                onClick={() => {
                  setShowLinkForm(true);
                  if (selectedRepo) {
                    fetchRepositoryIssues(selectedRepo._id);
                  }
                }}
                className="text-xs text-blue-500 hover:text-blue-700 flex items-center mr-2"
                title="Link to issue"
              >
                <FaLink className="mr-1" /> Link Issue
              </button>

              <button
                onClick={unlinkTask}
                className="text-xs text-gray-500 hover:text-red-500 flex items-center"
                title="Unlink from GitHub"
              >
                <FaUnlink className="mr-1" /> Unlink
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render button to link with GitHub
  return (
    <div className="mt-3 border-t pt-3">
      {!showLinkForm ? (
        <button
          onClick={() => setShowLinkForm(true)}
          className="flex items-center text-sm text-gray-600 hover:text-blue-600"
        >
          <FaGithub className="mr-1" /> Link with GitHub
        </button>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium flex items-center">
              <FaGithub className="mr-1" /> Link with GitHub
            </h4>
            <button
              onClick={() => setShowLinkForm(false)}
              className="text-xs text-gray-500"
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-2 rounded text-xs mb-2">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="block text-xs text-gray-600 mb-1">
              Select Repository:
            </label>
            <select
              value={selectedRepo?._id || ""}
              onChange={handleRepositorySelect}
              className="w-full p-2 border rounded text-sm"
              disabled={loading}
            >
              <option value="">Select a repository</option>
              {repositories.map((repo) => (
                <option key={repo._id} value={repo._id}>
                  {repo.full_name}
                </option>
              ))}
            </select>
          </div>

          {selectedRepo && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs text-gray-600">
                  Link to Issue (Optional):
                </label>
                {loadingIssues && (
                  <span className="text-xs text-gray-500">
                    Loading issues...
                  </span>
                )}
              </div>

              {issues.length > 0 ? (
                <div className="max-h-40 overflow-y-auto border rounded">
                  {issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-2 text-sm hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => linkTaskToIssue(issue.number)}
                    >
                      <div className="font-medium">{issue.title}</div>
                      <div className="text-xs text-gray-500">
                        #{issue.number} opened by {issue.user.login}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loadingIssues && (
                  <div className="text-sm text-gray-500 mb-3">
                    No open issues found in this repository.
                  </div>
                )
              )}

              <div className="mt-3">
                <button
                  onClick={linkTaskToRepo}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Link to Repository
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskWithGitHub;
