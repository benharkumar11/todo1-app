import React from "react";
import "./styles.css";

const TaskItem = ({ task, isSelected, onCheckboxChange, onDelete }) => {
  return (
    <tr className="task-row">
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onCheckboxChange(task.id)}
        />
      </td>
      <td>{task.title || "Untitled Task"}</td>
      <td>
        <span
          className={`status-badge ${
            task.status
              ? task.status.toLowerCase().replace(" ", "-")
              : "not-started"
          }`}
        >
          {task.status || "Not Started"}
        </span>
      </td>
      <td>
        <span
          className={`priority-badge ${
            task.priority ? task.priority.toLowerCase() : "low"
          }`}
        >
          {task.priority || "Low"}
        </span>
      </td>
      <td>
        <button className="delete-btn" onClick={() => onDelete(task.id)}>
          🗑
        </button>
      </td>
    </tr>
  );
};

export default TaskItem;
