import React from "react";
import "./styles.css";

const TaskItem = ({ task, isSelected, onCheckboxChange, onEdit }) => {
  return (
    <tr className="task-row">
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onCheckboxChange(task.id)}
        />
      </td>
      <td>{task.title}</td>
      <td>
        <span
          className={`status-badge ${task.status
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {task.status}
        </span>
      </td>
      <td>
        <span className={`priority-badge ${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
      </td>
      <td>
        <button className="edit-btn" onClick={() => onEdit(task)}>
          ✏️ Edit
        </button>
      </td>
    </tr>
  );
};

export default TaskItem;
