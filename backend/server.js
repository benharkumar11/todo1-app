const express = require("express");
const cors = require("cors");
const fs = require("fs");
const filePath = "./tasks.json"; // 📂 File to store tasks

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🛠 Load tasks from file (if exists)
let tasks = [];
if (fs.existsSync(filePath)) {
  tasks = JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// 🛠 Function to save tasks to file
const saveTasks = () => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

// ✅ API: Get All Tasks
app.get("/api/todos", (req, res) => {
  console.log("Sending tasks from backend:", tasks);
  res.json(tasks);
});

// ✅ API: Add New Task
app.post("/api/todos", (req, res) => {
  const { title, status, priority } = req.body;

  // Check if a task with the same title already exists
  const existingTask = tasks.find((task) => task.title === title);
  if (existingTask) {
    return res
      .status(409)
      .json({ error: "Task already exists! Please enter a unique task." });
  }

  const newTask = {
    id: Date.now(),
    title,
    status,
    priority,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/api/todos/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const { title, status, priority } = req.body;

  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  // Update task fields
  if (title !== undefined) tasks[taskIndex].title = title;
  if (status !== undefined) tasks[taskIndex].status = status;
  if (priority !== undefined) tasks[taskIndex].priority = priority;

  res.json(tasks[taskIndex]); // Send updated task
});

// ✅ API: Delete Task
app.delete("/api/todos/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks(); // 🛠 Save updated tasks to file

  res.status(200).json({ message: "Task deleted successfully" });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
