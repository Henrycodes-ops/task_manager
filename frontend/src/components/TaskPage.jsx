import React, { useState } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";

const TaskPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // This function will be called after a new task is created
  const handleTaskCreated = (newTask) => {
    // Increment the refresh trigger to force TaskList to re-fetch tasks
    setRefreshTrigger((prev) => prev + 1);
    console.log("Task created, refreshing list:", newTask);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Task Manager</h1>

      <div className="mb-8">
        <TaskInput onTaskCreate={handleTaskCreated} />
      </div>

      {/* Pass the refreshTrigger as a key to force re-render */}
      <TaskList key={refreshTrigger} />
    </div>
  );
};

export default TaskPage;
