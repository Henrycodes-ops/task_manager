import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskInput from './TaskInput';
import GitHubIntegration from './GitHubIntegration';
import TaskList from './TaskList';
import AIAssistant from './AIAssistant';
import api from '../config/api';
import { getUser } from '../utils/auth';
import '../components/css/taskManager.css';
import axios from 'axios';

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
      const response = await axios.get(api.tasks.list);
      if (response.data.success) {
        setTasks(response.data.data);
      } else {
        setError(response.data.error || 'Failed to fetch tasks');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreate = async (taskData) => {
    try {
      setLoading(true);
      const response = await axios.post(api.tasks.create, taskData);
      if (response.data.success) {
        setTasks([response.data.data, ...tasks]);
        setSelectedRepo(null);
      } else {
        setError(response.data.error || 'Failed to create task');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error creating task');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      setLoading(true);
      const response = await axios.put(api.tasks.update, { taskId, ...updates });
      if (response.data.success) {
        setTasks(tasks.map(task => 
          task._id === taskId ? response.data.data : task
        ));
      } else {
        setError(response.data.error || 'Failed to update task');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error updating task');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${api.tasks.delete}/${taskId}`);
      if (response.data.success) {
        setTasks(tasks.filter(task => task._id !== taskId));
      } else {
        setError(response.data.error || 'Failed to delete task');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error deleting task');
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
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />
        </div>
      </div>
    </div>
  );
} 