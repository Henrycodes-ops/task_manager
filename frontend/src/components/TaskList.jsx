// TaskList.jsx
import React, { useState, useEffect } from "react";
import api from "../utils/api";

const TaskList = ({ repository = null, refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await api.get("/tasks", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: repository ? { repository } : {},
        });

        // Ensure we're setting the response.data instead of response object
        setTasks(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [repository, refreshTrigger]);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase() || "default") {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-md border border-red-200 text-red-700">
        {error}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="">
        No tasks found. Add a new task to get started!
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <h2 className="task-list-title">Your Tasks</h2>
      {tasks.map((task) => (
        <div key={task._id} className="task-card glass">
          <div className="task-card-header">
            <div className="task-card-main">
              <h3 className="task-title">{task.title}</h3>
              {task.description && (
                <p className="task-desc">{task.description}</p>
              )}
            </div>
            <div className="task-tags">
              <span
                className={`task-priority ${getPriorityColor(task.priority)}`}
              >
                {task.priority
                  ? task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)
                  : "None"}
              </span>
              <span className="task-status">
                {task.status
                  ? task.status.charAt(0).toUpperCase() + task.status.slice(1)
                  : "No Status"}
              </span>
            </div>
          </div>
          <div className="task-dates">
            <div>
              Created:{" "}
              {task.createdAt
                ? new Date(task.createdAt).toLocaleDateString()
                : "Unknown"}
            </div>
            <div>Due: {formatDate(task.dueDate)}</div>
          </div>
        </div>
      ))}
    </div>
  );

};

export default TaskList;
