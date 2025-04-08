import { useState, useEffect, useContext } from 'react';
import { FiGithub, FiRefreshCw } from 'react-icons/fi';
import api from '../config/api';
import { fetchWithAuth } from '../utils/api';
import { useNavigate } from 'react-router-dom';
// import '../components/css/githubIntegration.css';

export default function GitHubIntegration({ onRepoSelect, selectedRepo }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGitHubAuthenticated, setIsGitHubAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkGitHubAuth = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setIsGitHubAuthenticated(!!user.githubId);
      }
    } catch (error) {
      console.error('Error checking GitHub auth:', error);
    }
  };

  const fetchRepos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchWithAuth(api.github.repos);
      setRepos(data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setError('Failed to load repositories');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('github_oauth_state', state);
    localStorage.setItem('github_redirect_path', window.location.pathname);
    
    const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${api.auth.githubClientId}&redirect_uri=${encodeURIComponent(api.auth.githubRedirectUri)}&scope=user:email,repo&state=${state}`;
    window.location.href = githubOAuthUrl;
  };

  useEffect(() => {
    checkGitHubAuth();
    if (isGitHubAuthenticated) {
      fetchRepos();
    }
  }, [isGitHubAuthenticated]);

  if (!isGitHubAuthenticated) {
    return (
      <div className="github-integration-container">
        <div className="github-header">
          <FiGithub className="github-icon" />
          <h3>GitHub Integration</h3>
        </div>
        <div className="github-auth-message">
          <p>Connect your GitHub account to access repositories</p>
          <button
            className="github-auth-button"
            onClick={handleGitHubLogin}
          >
            Connect with GitHub
          </button>
        </div>
      </div>
    );
  }

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