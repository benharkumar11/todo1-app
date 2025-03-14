import React, { useState, useEffect } from "react";
import "./TaskForm.css";

const TaskForm = ({ onClose, onSave, task }) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [priority, setPriority] = useState("None");
  const [loading, setLoading] = useState(false);
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStatus(task.status);
      setPriority(task.priority);
    }
  }, [task]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setChangesMade(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title cannot be empty.");
      return;
    }

    const newTask = task
      ? { ...task, title, status, priority }
      : { title, status, priority };

    setLoading(true);
    try {
      await onSave(newTask);
      setLoading(false);
      setChangesMade(false);
      onClose();
    } catch (error) {
      setLoading(false);
      console.error("Error saving task:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{task ? "Edit Task" : "Create Task"}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">
            {task ? "Edit your task details" : "Create a new task."}
          </p>

          {/* ✅ Label for Title */}
          <label className="label">Title</label>
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={handleInputChange(setTitle)}
            className="task-input"
            required
          />

          <div className="dropdown-container">
            {/* ✅ Label for Status */}
            <div className="dropdown-item">
              <label className="label">Status</label>
              <select
                value={status}
                onChange={handleInputChange(setStatus)}
                className="task-dropdown"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* ✅ Label for Priority */}
            <div className="dropdown-item">
              <label className="label">Priority</label>
              <select
                value={priority}
                onChange={handleInputChange(setPriority)}
                className="task-dropdown"
              >
                <option value="None">None</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="save-btn"
            onClick={handleSubmit}
            disabled={loading || !changesMade}
          >
            {loading ? "Saving..." : task ? "Update Task" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
