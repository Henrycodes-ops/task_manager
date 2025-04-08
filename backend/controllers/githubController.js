const axios = require('axios');
const User = require('../models/user');

exports.getRepos = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.githubAccessToken) {
      return res.status(401).json({ error: 'GitHub access token not found' });
    }

    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${user.githubAccessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub repositories' });
  }
};

exports.getBranches = async (req, res) => {
  try {
    const { repo } = req.params;
    const user = await User.findById(req.user.id);
    if (!user || !user.githubAccessToken) {
      return res.status(401).json({ error: 'GitHub access token not found' });
    }

    const response = await axios.get(`https://api.github.com/repos/${repo}/branches`, {
      headers: {
        Authorization: `Bearer ${user.githubAccessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching GitHub branches:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub branches' });
  }
}; 