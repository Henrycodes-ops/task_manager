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
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(api.tasks.list, {
        withCredentials: true
      });
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
      setError(null);
      const response = await axios.post(api.tasks.create, {
        ...taskData,
        githubRepo: selectedRepo
      }, {
        withCredentials: true
      });
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
      setError(null);
      const response = await axios.put(api.tasks.update, { taskId, ...updates }, {
        withCredentials: true
      });
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
      setError(null);
      const response = await axios.delete(`${api.tasks.delete}/${taskId}`, {
        withCredentials: true
      });
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
    setSuggestions([...suggestions, suggestion]);
  };

  return (
    <div className="task-manager">
      <div className="task-manager-header">
        <h1>Task Manager</h1>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="task-manager-content">
        <div className="task-input-section">
          <TaskInput
            onSubmit={handleTaskCreate}
            selectedRepo={selectedRepo}
            loading={loading}
          />
          <GitHubIntegration
            onRepoSelect={setSelectedRepo}
            selectedRepo={selectedRepo}
          />
        </div>

        <div className="task-list-section">
          <AIAssistant
            onSuggestion={handleAISuggestion}
            suggestions={suggestions}
          />
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