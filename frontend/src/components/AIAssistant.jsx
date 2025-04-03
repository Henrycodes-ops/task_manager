import { useState } from 'react';
import { FiMessageSquare, FiSend } from 'react-icons/fi';
import api from '../config/api';
import '../components/css/aiAssistant.css';

export default function AIAssistant({ onSuggestion, suggestions }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    try {
      setLoading(true);
      setError('');
      const response = await fetch(api.ai.suggest, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        onSuggestion({
          message,
          suggestion: data.suggestion,
          timestamp: new Date(),
        });
        setMessage('');
      } else {
        setError(data.message || 'Failed to get AI suggestion');
      }
    } catch (error) {
      console.error('AI suggestion error:', error);
      setError('Failed to get AI suggestion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant-container">
      <div className="ai-header">
        <FiMessageSquare className="ai-icon" />
        <h3>AI Task Assistant</h3>
      </div>

      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="suggestion-item">
            <div className="user-message">{suggestion.message}</div>
            <div className="ai-response">{suggestion.suggestion}</div>
            <div className="suggestion-time">
              {new Date(suggestion.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="ai-input-form">
        <input
          type="text"
          placeholder="Ask for task suggestions..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !message.trim()}>
          <FiSend />
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">AI is thinking...</div>}
    </div>
  );
} 