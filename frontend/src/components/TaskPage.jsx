// TaskPage.jsx
import React, { useState } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";

const TaskPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskCreated = (newTask) => {
    setRefreshTrigger((prev) => prev + 1); // 👈 Triggers re-fetch in TaskList
    console.log("Task created, refreshing list:", newTask);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Cortex</h1>

      <div className="mb-8">
        <TaskInput onTaskCreate={handleTaskCreated} />
      </div>

      {/* ✅ Now we pass refreshTrigger instead of using `key` */}
      <TaskList refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default TaskPage;
