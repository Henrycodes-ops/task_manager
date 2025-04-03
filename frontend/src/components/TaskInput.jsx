import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import '../components/css/taskInput.css';

export default function TaskInput({ onSubmit, selectedRepo, loading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      description,
      priority,
      dueDate: dueDate || null,
      status: 'pending',
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
  };

  return (
    <div className="task-input-container">
      <form onSubmit={handleSubmit} className="task-input-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {selectedRepo && (
          <div className="github-repo-info">
            <span className="repo-name">{selectedRepo.name}</span>
            <span className="repo-branch">{selectedRepo.default_branch}</span>
          </div>
        )}

        <button type="submit" className="create-task-button" disabled={loading}>
          <FiPlus />
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
} 