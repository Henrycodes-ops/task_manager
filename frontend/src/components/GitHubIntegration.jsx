import { useState, useEffect } from 'react';
import { FiGithub, FiRefreshCw } from 'react-icons/fi';
import api from '../config/api';
import '../components/css/githubIntegration.css';

export default function GitHubIntegration({ onRepoSelect, selectedRepo }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRepos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(api.github.repos, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setRepos(data.repos);
      } else {
        setError(data.message || 'Failed to fetch repositories');
      }
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setError('Failed to load repositories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  return (
    <div className="github-integration-container">
      <div className="github-header">
        <FiGithub className="github-icon" />
        <h3>GitHub Repositories</h3>
        <button
          className="refresh-button"
          onClick={fetchRepos}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? 'spinning' : ''} />
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="repo-list">
        {loading ? (
          <div className="loading">Loading repositories...</div>
        ) : repos.length > 0 ? (
          repos.map((repo) => (
            <div
              key={repo.id}
              className={`repo-item ${
                selectedRepo?.id === repo.id ? 'selected' : ''
              }`}
              onClick={() => onRepoSelect(repo)}
            >
              <div className="repo-info">
                <span className="repo-name">{repo.name}</span>
                <span className="repo-description">{repo.description}</span>
              </div>
              <div className="repo-meta">
                <span className="repo-stars">
                  {repo.stargazers_count} stars
                </span>
                <span className="repo-language">{repo.language}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-repos">
            No repositories found. Make sure you have access to some repositories.
          </div>
        )}
      </div>
    </div>
  );
} 