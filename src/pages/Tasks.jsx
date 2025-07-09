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

  // Consts for editing states
  const [editingTaskID, setEditingTaskID] = useState(null);
  const [editedTask, setEditedTask] = useState(null);

  // CRUDI UI FUNCTIONS
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

  const handleMarkDone = async (id) => {
    const taskRef = doc(db,"tasks", id );
    await updateDoc(taskRef, {status: "done"});
    setTasks(
      tasks.map((task) => 
      task.id === id ? {...task, status: "done"} : task
      )
    );
  };

  const handleEdit = async () => {
    if (!editedTask) return;

    const taskRef = doc(db, "tasks", editingTaskID);
    await updateDoc(taskRef, editedTask);
    
    setTasks(tasks.map((task) =>
    task.id === editingTaskID ? {...task, ...editedTask} : task
    ));

    setEditingTaskID(null);
    setEditedTask(null);
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
        <li key={task.id} className="border p-4 rounded shadow space-y-1">
          {editingTaskID === task.id ? (
            // 🛠 Edit Mode
            <div className="space-y-2">
              <input
                type="text"
                className="w-full border p-1"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              />
              <textarea
                className="w-full border p-1"
                value={editedTask.description}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
              />
              <input
                type="datetime-local"
                className="w-full border p-1"
                value={editedTask.dueDate}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, dueDate: e.target.value })
                }
              />
              <select
                className="w-full border p-1"
                value={editedTask.priority}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, priority: e.target.value })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                className="w-full border p-1"
                value={editedTask.status}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, status: e.target.value })
                }
              >
                <option value="todo">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
              </select>

              <div className="space-x-2">
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 text-black px-3 py-1 rounded text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingTaskID(null);
                    setEditedTask(null);
                  }}
                  className="bg-gray-400 text-black px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // ✅ Normal View
            <>
              <h2 className="font-semibold text-lg">{task.title}</h2>
              {task.description && <p>{task.description}</p>}
              {task.dueDate && <p className="text-sm text-gray-600">Due: {task.dueDate}</p>}
              <p className="text-sm">Priority: {task.priority}</p>
              <p className="text-sm">Status: {task.status}</p>

              <div className="space-x-2 mt-2">
                <button
                  onClick={() => handleMarkDone(task.id)}
                  className="px-3 py-1 bg-green-500 text-black rounded text-sm"
                >
                  Mark as Done
                </button>
                <button
                  onClick={() => {
                    setEditingTaskID(task.id);
                    setEditedTask({
                      title: task.title,
                      description: task.description || "",
                      dueDate: task.dueDate || "",
                      priority: task.priority,
                      status: task.status,
                    });
                  }}
                  className="px-3 py-1 bg-yellow-500 text-black rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-3 py-1 bg-red-500 text-black rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
        ))}
      </ul>
    </div>
  );
}
