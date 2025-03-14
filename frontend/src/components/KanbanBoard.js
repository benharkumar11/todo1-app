import React from "react";
import "./kanbanBoard.css";

const KanbanBoard = ({ tasks, onEdit }) => {
  const priorityLevels = ["None", "Low", "Medium", "High", "Urgent"];

  return (
    <div className="kanban-board">
      {priorityLevels.map((priority) => (
        <div key={priority} className="kanban-column">
          <h3>{priority}</h3>
          {tasks
            .filter((task) => task.priority === priority)
            .map((task) => (
              <div key={task.id} className="kanban-card">
                <h4>{task.title}</h4>
                <p>Status: {task.status}</p>
                <button onClick={() => onEdit(task)}>Edit</button>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
