import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/tasks/";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  async function fetchTasks() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Unable to load tasks.");
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          is_completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to add task.");
      }

      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
      setTitle("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="app-shell">
      <section className="task-panel">
        <div className="panel-header">
          <h1>Task Manager</h1>
          <span>{tasks.length} tasks</span>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter a new task"
          />
          <button type="submit">Add</button>
        </form>

        {error && <p className="error">{error}</p>}

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.is_completed ? "done" : ""}>
              <span>{task.title}</span>
              <small>{task.is_completed ? "Completed" : "Pending"}</small>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
