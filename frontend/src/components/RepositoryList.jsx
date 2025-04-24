import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaGithub, FaSync, FaPlus, FaTrash } from "react-icons/fa";

const RepositoryList = ({ onSelectRepository }) => {
  const [githubRepos, setGithubRepos] = useState([]);
  const [importedRepos, setImportedRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState({});
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("imported"); // 'github' or 'imported'

  // Fetch user's GitHub repositories
  const fetchGithubRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/github/repositories");
      setGithubRepos(response.data);
    } catch (err) {
      setError(
        "Failed to fetch GitHub repositories. Please ensure you have connected your GitHub account."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's imported repositories
  const fetchImportedRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/github/repositories/imported");
      setImportedRepos(response.data);
    } catch (err) {
      setError("Failed to fetch imported repositories.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Import a repository
  const importRepository = async (repoId) => {
    try {
      setImportLoading((prev) => ({ ...prev, [repoId]: true }));
      const response = await axios.post("/api/github/repositories/import", {
        repoId,
      });

      // Add to imported list if not already there
      setImportedRepos((prev) => {
        const exists = prev.some((repo) => repo._id === response.data._id);
        if (!exists) {
          return [...prev, response.data];
        }
        return prev.map((repo) =>
          repo._id === response.data._id ? response.data : repo
        );
      });

      // Show success notification
    } catch (err) {
      setError("Failed to import repository.");
      console.error(err);
    } finally {
      setImportLoading((prev) => ({ ...prev, [repoId]: false }));
    }
  };

  // Sync repository with GitHub
  const syncRepository = async (repoId) => {
    try {
      setImportLoading((prev) => ({ ...prev, [repoId]: true }));
      const response = await axios.put(
        `/api/github/repositories/${repoId}/sync`
      );

      // Update in the imported list
      setImportedRepos((prev) =>
        prev.map((repo) => (repo._id === repoId ? response.data : repo))
      );

      // Show success notification
    } catch (err) {
      setError("Failed to sync repository.");
      console.error(err);
    } finally {
      setImportLoading((prev) => ({ ...prev, [repoId]: false }));
    }
  };

  // Remove a repository
  const removeRepository = async (repoId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this repository? Associated tasks will remain."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`/api/github/repositories/${repoId}`);

      // Remove from imported list
      setImportedRepos((prev) => prev.filter((repo) => repo._id !== repoId));

      // Show success notification
    } catch (err) {
      setError("Failed to remove repository.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (tab === "github") {
      fetchGithubRepositories();
    } else {
      fetchImportedRepositories();
    }
  }, [tab]);

  const renderTabs = () => (
    <div className="flex border-b mb-4">
      <button
        className={`py-2 px-4 ${
          tab === "imported"
            ? "border-b-2 border-blue-500 font-medium text-blue-600"
            : "text-gray-500"
        }`}
        onClick={() => setTab("imported")}
      >
        Imported Repositories
      </button>
      <button
        className={`py-2 px-4 ${
          tab === "github"
            ? "border-b-2 border-blue-500 font-medium text-blue-600"
            : "text-gray-500"
        }`}
        onClick={() => setTab("github")}
      >
        GitHub Repositories
      </button>
    </div>
  );

  const renderGithubRepositories = () => (
    <div>
      {githubRepos.map((repo) => (
        <div
          key={repo.id}
          className="border rounded-lg p-4 mb-3 flex justify-between items-center hover:bg-gray-50"
        >
          <div>
            <h3 className="font-medium">{repo.full_name}</h3>
            <p className="text-sm text-gray-600">
              {repo.description || "No description"}
            </p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <span className="mr-3">⭐ {repo.stargazers_count}</span>
              <span>🍴 {repo.forks_count}</span>
            </div>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center"
            onClick={() => importRepository(repo.id)}
            disabled={importLoading[repo.id]}
          >
            {importLoading[repo.id] ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Importing...
              </span>
            ) : (
              <>
                <FaPlus className="mr-1" /> Import
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );

  const renderImportedRepositories = () => (
    <div>
      {importedRepos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FaGithub className="mx-auto text-5xl mb-3" />
          <p>No repositories imported yet.</p>
          <button
            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setTab("github")}
          >
            Import Repositories
          </button>
        </div>
      ) : (
        importedRepos.map((repo) => (
          <div
            key={repo._id}
            className="border rounded-lg p-4 mb-3 hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelectRepository && onSelectRepository(repo)}
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium">{repo.full_name}</h3>
                <p className="text-sm text-gray-600">
                  {repo.description || "No description"}
                </p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span className="mr-3">⭐ {repo.stars}</span>
                  <span className="mr-3">🍴 {repo.forks}</span>
                  <span>🔴 {repo.open_issues} open issues</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Last synced: {new Date(repo.last_synced).toLocaleString()}
                </div>
              </div>
              <div className="flex">
                <button
                  className="text-gray-500 hover:text-blue-500 p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    syncRepository(repo._id);
                  }}
                  title="Sync with GitHub"
                  disabled={importLoading[repo._id]}
                >
                  {importLoading[repo._id] ? (
                    <svg
                      className="animate-spin h-5 w-5 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <FaSync />
                  )}
                </button>
                <button
                  className="text-gray-500 hover:text-red-500 p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRepository(repo._id);
                  }}
                  title="Remove repository"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <FaGithub className="mr-2" /> GitHub Repositories
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {renderTabs()}

      {loading ? (
        <div className="flex justify-center py-8">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : tab === "github" ? (
        renderGithubRepositories()
      ) : (
        renderImportedRepositories()
      )}
    </div>
  );
};

export default RepositoryList;
