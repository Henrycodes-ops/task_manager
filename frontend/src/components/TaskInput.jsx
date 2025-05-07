import React, { useState } from "react";
import api from "../utils/api"; // Make sure this path is correct
import "../components/css/taskInput.css";


const API_URL = "http://localhost:3001/api";

const TaskInput = ({ onTaskCreate, repository = null }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use the API directly without referencing endpoints
      const response = await api.post(
        `${API_URL}/tasks`,
        {
          title: taskTitle,
          description: taskDescription,
          priority,
          dueDate: dueDate || null,
          repository,
          status: "todo", // Adding default status as it's required in your model
        },
        {
          withCredentials: true, // Important for cookies
          headers: {
            "Content-Type": "application/json",
            // Add auth token if needed
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Reset form
      setTaskTitle("");
      setTaskDescription("");
      setPriority("medium");
      setDueDate("");
      setShowForm(false);

      // Update parent component
      if (onTaskCreate) {
        onTaskCreate(response.data);
      }
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <div className="task-input-container">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200"
        >
          <span className="mr-2">+</span> Add New Task
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="form-group">
          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

          <div className="mb-3">
            <label
              htmlFor="taskTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Title
            </label>
            <input
              type="text"
              id="taskTitle"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="taskDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              id="taskDescription"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter task description"
              rows="2"
            />
          </div>

          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-3 md:mb-0">
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="w-full md:w-1/2 px-2">
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Due Date (Optional)
              </label>
              <input
                type="date"
                id="dueDate"
                value={formatDate(dueDate)}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-task-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <span className="mr-1">+</span> Create Task
                </>
              )}
            </button>
          </div>
        </form>
      )}

      
    </div>
  );
};

export default TaskInput;
