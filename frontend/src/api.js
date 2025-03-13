import axios from "axios";

// Backend API base URL
const API_URL = "http://localhost:3000/api/todos";

// Fetch all tasks from backend
export const fetchTasks = () => axios.get(API_URL);

// Create a new task
export const createTask = (taskData) => axios.post(API_URL, taskData);

// Update a task (edit)
export const updateTask = (taskId, updatedData) =>
  axios.put(`${API_URL}/${taskId}`, updatedData);

// Delete a task
export const deleteTask = (taskId) => axios.delete(`${API_URL}/${taskId}`);
