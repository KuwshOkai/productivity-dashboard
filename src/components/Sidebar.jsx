import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-gray-700 ${
      isActive ? "bg-gray-800 text-white" : "text-gray-300"
    }`;

  return (
    <aside className="w-48 bg-gray-900 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Navigation</h2>
      <nav className="space-y-2">
        <NavLink to="/tasks" className={linkClass}>Tasks</NavLink>
        <NavLink to="/pomodoro" className={linkClass}>Pomodoro</NavLink>
        <NavLink to="/stats" className={linkClass}>Stats</NavLink>
      </nav>
    </aside>
  );
}
