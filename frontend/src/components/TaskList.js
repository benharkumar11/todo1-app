import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import SortDropdown from "./SortDropDown";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import "./styles.css";

const TaskList = () => {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  // ✅ 1️⃣ Fetch tasks from backend on page load
  useEffect(() => {
    fetch("http://localhost:3000/api/todos")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched tasks:", data);
        if (JSON.stringify(tasks) !== JSON.stringify(data)) {
          setTasks(data);
        }
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // ✅ 2️⃣ Handle Saving a New Task (POST)
  const handleSaveTask = async (newTask) => {
    try {
      const response = await fetch("http://localhost:3000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Failed to save task");
      }

      const savedTask = await response.json();

      // ✅ Update the UI immediately with the new task
      setTasks((prevTasks) => [...prevTasks, savedTask]);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // ✅ Handle Checkbox Selection
  const handleCheckboxChange = (taskId) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(taskId)
        ? prevSelected.filter((id) => id !== taskId)
        : [...prevSelected, taskId]
    );
  };

  // ✅ 4️⃣ Handle Bulk Delete (DELETE)
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedTasks.map((taskId) =>
          fetch(`http://localhost:3000/api/todos/${taskId}`, {
            method: "DELETE",
          })
        )
      );
      setTasks(tasks.filter((task) => !selectedTasks.includes(task.id)));
      setSelectedTasks([]);
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  return (
    <div className="page-container">
      {/* ✅ Top Section: Title + Action Buttons */}
      <div className="top-container">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Manage all tasks.</p>
        </div>
        <div className="top-buttons">
          <button
            className="bulk-delete-btn"
            onClick={handleBulkDelete}
            disabled={selectedTasks.length === 0}
          >
            🗑
          </button>
          <button className="create-task-btn" onClick={() => setShowForm(true)}>
            Create Task
          </button>
        </div>
      </div>

      {/* ✅ Third Section: Search Bar + Filters */}
      <div className="search-filter-container">
        <SearchBar />
        <Filters />
      </div>

      {/* ✅ Fourth Section: Task Table with Checkboxes */}
      <div className="task-table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th></th>
              <th>
                <SortDropdown label="Title" sortKey="title" />
              </th>
              <th>
                <SortDropdown label="Status" sortKey="status" />
              </th>
              <th>
                <SortDropdown label="Priority" sortKey="priority" />
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isSelected={selectedTasks.includes(task.id)}
                  onCheckboxChange={handleCheckboxChange}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5">No tasks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ TaskForm Modal */}
      {showForm && (
        <TaskForm onClose={() => setShowForm(false)} onSave={handleSaveTask} />
      )}
    </div>
  );
};

export default TaskList;
