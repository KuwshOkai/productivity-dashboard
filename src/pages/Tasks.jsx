// src/pages/Tasks.jsx
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    status: "todo",
  });

  // Fetch tasks on load
  useEffect(() => {
    const fetchTasks = async () => {
      const snapshot = await getDocs(collection(db, "tasks"));
      const tasksList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
    };
    fetchTasks();
  }, []);

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "tasks"), {
      ...newTask,
      createdAt: serverTimestamp(),
    });
    setTasks([...tasks, { id: docRef.id, ...newTask }]);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "low",
      status: "todo",
    });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db,"tasks", id));
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📋 Task List</h1>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="space-y-4 border p-4 rounded bg-white shadow">
        <input
          type="text"
          required
          placeholder="Title"
          className="w-full border p-2"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="Description (optional)"
          className="w-full border p-2"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
          type="datetime-local"
          className="w-full border p-2"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <select
          className="w-full border p-2"
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          className="w-full border p-2"
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="todo">To Do</option>
          <option value="in progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button type="submit" className="bg-blue-600 text-black px-4 py-2 rounded">
          Add Task
        </button>
      </form>

      {/* Tasks Display */}
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold text-lg">{task.title}</h2>
            {task.description && <p>{task.description}</p>}
            {task.dueDate && <p className="text-sm text-gray-600">Due: {task.dueDate}</p>}
            <p className="text-sm">Priority: {task.priority}</p>
            <p className="text-sm">Status: {task.status}</p>

            {/*Buttons*/}
            <div className="space-x-2 mt-2">
              <button
                onClick={() => handleMarkDone(task.id)}
                className="px-3 py-1 bg-green-500 text-black rounded text-sm"
              >
                Mark as Done
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="px-3 py-1 bg-red-500 text-black rounded text-sm"
              >
                  Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
