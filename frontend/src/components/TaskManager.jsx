import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskInput from './TaskInput';
import GitHubIntegration from './GitHubIntegration';
import TaskList from './TaskList';
import AIAssistant from './AIAssistant';
import api from '../config/api';
import { getUser } from '../utils/auth';
import '../components/css/taskManager.css';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [user, navigate]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(api.tasks.list, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreate = async (taskData) => {
    try {
      setLoading(true);
      const response = await fetch(api.tasks.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskData,
          githubRepo: selectedRepo,
        }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setTasks([...tasks, data.task]);
        setSelectedRepo(null);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleAISuggestion = (suggestion) => {
    setAiSuggestions([...aiSuggestions, suggestion]);
  };

  return (
    <div className="task-manager-container">
      <div className="task-manager-header">
        <h1>Task Manager</h1>
        {user.githubId && (
          <GitHubIntegration
            onRepoSelect={setSelectedRepo}
            selectedRepo={selectedRepo}
          />
        )}
      </div>

      <div className="task-manager-content">
        <div className="task-input-section">
          <TaskInput
            onSubmit={handleTaskCreate}
            selectedRepo={selectedRepo}
            loading={loading}
          />
          <AIAssistant
            onSuggestion={handleAISuggestion}
            suggestions={aiSuggestions}
          />
        </div>

        <div className="task-list-section">
          {error && <div className="error-message">{error}</div>}
          <TaskList
            tasks={tasks}
            loading={loading}
            onTaskUpdate={fetchTasks}
          />
        </div>
      </div>
    </div>
  );
} 