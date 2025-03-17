import React from "react";

const BulkActions = ({ selectedTasks, setSelectedTasks, setTasks }) => {
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedTasks.map((taskId) =>
          fetch(`http://localhost:3000/api/todos/${taskId}`, {
            method: "DELETE",
          })
        )
      );
      setTasks((prevTasks) =>
        prevTasks.filter((task) => !selectedTasks.includes(task.id))
      );
      setSelectedTasks([]);
      alert("Selected tasks deleted successfully! 🗑");
    } catch (error) {
      console.error("Error deleting tasks:", error);
      alert("Error deleting tasks. ❌");
    }
  };

  return (
    <button
      className="bulk-delete-btn"
      onClick={handleBulkDelete}
      disabled={selectedTasks.length === 0}
    >
      🗑
    </button>
  );
};

export default BulkActions;
