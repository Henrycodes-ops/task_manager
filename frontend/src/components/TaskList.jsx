import { useState } from "react";
import { FiCheck, FiEdit2, FiTrash2, FiGitBranch } from "react-icons/fi";
import axios from "axios";
import api from "../config/api";

export default function TaskList({
  tasks,
  loading,
  onTaskUpdate,
  onTaskDelete,
}) {
  const [editingTask, setEditingTask] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await onTaskUpdate(taskId, { status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await onTaskDelete(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setEditMode(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the onTaskUpdate function passed as prop instead of direct API call
      await onTaskUpdate(editingTask._id, {
        title: editingTask.title,
        description: editingTask.description,
      });
      setEditMode(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="task-list-container">
      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : tasks.length > 0 ? (
        <div className="task-list">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`task-item ${task.status} priority-${task.priority}`}
            >
              {editMode && editingTask?._id === task._id ? (
                <form onSubmit={handleEditSubmit} className="edit-form">
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                  />
                  <textarea
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
                      })
                    }
                  />
                  <div className="edit-actions">
                    <button type="submit">Save</button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setEditingTask(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="task-content">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    {task.githubRepo && (
                      <div className="github-info">
                        <FiGitBranch />
                        <span>{task.githubRepo.name}</span>
                      </div>
                    )}
                    <div className="task-meta">
                      <span className="priority">{task.priority}</span>
                      <span className="due-date">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No due date"}
                      </span>
                    </div>
                  </div>
                  <div className="task-actions">
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          task._id,
                          task.status === "completed" ? "pending" : "completed"
                        )
                      }
                      className="status-button"
                    >
                      <FiCheck />
                    </button>
                    <button
                      onClick={() => handleEdit(task)}
                      className="edit-button"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="delete-button"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-tasks">No tasks found. Create your first task!</div>
      )}
    </div>
  );
}
