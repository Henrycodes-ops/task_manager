import  { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function Task() {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>
      <p className="mb-4">Select a date to view or add tasks:</p>

      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        className="bg-white border rounded-lg shadow-md"
      />

      {selectedDate && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">
            Tasks for {selectedDate.toLocaleDateString()}
          </h2>
          {/* Add task list or task creation form here */}
          <p className="text-gray-600">No tasks for this date</p>
        </div>
      )}
    </div>
  );
}
