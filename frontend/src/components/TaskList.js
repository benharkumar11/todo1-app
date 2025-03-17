import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import KanbanBoard from "./KanbanBoard";
import BulkActions from "./BulkActions";
import "./styles.css";

const TaskList = () => {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    fetch("http://localhost:3000/api/todos")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const handleSaveTask = async (task) => {
    try {
      let updatedTasks;
      if (task.id) {
        const response = await fetch(
          `http://localhost:3000/api/todos/${task.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
          }
        );

        if (!response.ok) throw new Error("Failed to update task");

        const updatedTask = await response.json();
        updatedTasks = tasks.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        );
      } else {
        const response = await fetch("http://localhost:3000/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        });

        if (!response.ok) throw new Error("Failed to create task");

        const createdTask = await response.json();
        updatedTasks = [...tasks, createdTask];
      }

      setTasks(updatedTasks);
      setShowForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCheckboxChange = (taskId) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(taskId)
        ? prevSelected.filter((id) => id !== taskId)
        : [...prevSelected, taskId]
    );
  };

  const handleSort = (key) => {
    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(newDirection);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // ✅ Apply Filtering Dynamically on Every Change
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filterStatus === "ALL" || task.status === filterStatus;
    const matchesPriority =
      filterPriority === "ALL" || task.priority === filterPriority;
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // ✅ Apply Sorting AFTER Filtering
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortKey) return 0;
    const valueA = a[sortKey] ? a[sortKey].toLowerCase() : "";
    const valueB = b[sortKey] ? b[sortKey].toLowerCase() : "";
    return sortDirection === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  return (
    <div className="page-container">
      <div className="top-container">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Manage all tasks.</p>
        </div>
        <div className="top-buttons">
          <BulkActions
            selectedTasks={selectedTasks}
            setSelectedTasks={setSelectedTasks}
            setTasks={setTasks}
          />
          <button
            className="create-task-btn"
            onClick={() => {
              setShowForm(true);
              setEditingTask(null);
            }}
          >
            Create Task
          </button>
        </div>
      </div>

      <div className="view-toggle">
        <button
          className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          List View
        </button>
        <button
          className={`toggle-btn ${viewMode === "kanban" ? "active" : ""}`}
          onClick={() => setViewMode("kanban")}
        >
          Kanban View
        </button>
      </div>

      <div className="search-filter-container">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
        />
        <Filters
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
        />
      </div>

      {viewMode === "list" ? (
        <div className="task-table-container">
          <table className="task-table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedTasks(
                        e.target.checked ? tasks.map((task) => task.id) : []
                      )
                    }
                    checked={
                      selectedTasks.length === tasks.length && tasks.length > 0
                    }
                  />
                </th>
                <th onClick={() => handleSort("title")}>Title</th>
                <th onClick={() => handleSort("status")}>Status</th>
                <th onClick={() => handleSort("priority")}>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.length > 0 ? (
                sortedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isSelected={selectedTasks.includes(task.id)}
                    onCheckboxChange={handleCheckboxChange}
                    onEdit={handleEditTask}
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
      ) : (
        <KanbanBoard tasks={sortedTasks} onEdit={handleEditTask} />
      )}

      {showForm && (
        <TaskForm
          onClose={() => setShowForm(false)}
          onSave={handleSaveTask}
          task={editingTask}
        />
      )}
    </div>
  );
};

export default TaskList;
