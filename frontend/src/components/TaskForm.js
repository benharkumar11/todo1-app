import React, { useState } from "react";
import "./styles.css";

const TaskForm = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [priority, setPriority] = useState("Low");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title cannot be empty.");
      return;
    }

    const newTask = { title, status, priority };

    try {
      const response = await fetch("http://localhost:3000/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      const createdTask = await response.json();
      onSave(createdTask);
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create Task</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">Create a new task.</p>

          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="task-input"
            required
          />

          <div className="dropdown-container">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="task-dropdown"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="task-dropdown"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button type="submit" className="save-btn" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
