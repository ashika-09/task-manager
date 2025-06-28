import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

axios.defaults.withCredentials = true;

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    completed: false,
  });

  useEffect(() => {
    fetchTasks();
  }, [filter, page]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/tasks`, {
        params: { page, limit: 5 },
      });
      let filteredTasks = res.data.task || [];
      if (filter === "completed") {
        filteredTasks = filteredTasks.filter((task) => task.completed);
      } else if (filter === "pending") {
        filteredTasks = filteredTasks.filter((task) => !task.completed);
      }
      setTasks(filteredTasks);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/");
      } else {
        console.error("Failed to fetch tasks:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task:", err.message);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate).toISOString().split("T")[0],
      completed: task.completed,
    });
    setEditId(task._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.message);
      alert("Logout failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        dueDate: form.dueDate.split("-").reverse().join("/"),
      };

      let res;
      if (isEditing) {
        res = await axios.put(`${BASE_URL}/tasks/${editId}`, payload);
      } else {
        res = await axios.post(`${BASE_URL}/tasks`, payload);
      }

      if (res.status === 200 || res.status === 201) {
        setShowModal(false);
        setForm({ title: "", description: "", dueDate: "", completed: false });
        setIsEditing(false);
        setEditId(null);
        fetchTasks();
      }
    } catch (err) {
      console.error("Failed to submit task:", err.message);
      alert("Failed to submit task");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-blue-900">📋 Task Manager</h1>
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm focus:outline-blue-500"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <button
            onClick={() => {
              setForm({
                title: "",
                description: "",
                dueDate: "",
                completed: false,
              });
              setIsEditing(false);
              setEditId(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 transition"
          >
            + Add Task
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-xl shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-xl text-center">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-xl text-center">No tasks found.</p>
      ) : (
        <>
          <ul className="space-y-4 max-w-4xl mx-auto">
            {tasks.map((task) => (
              <li
                key={task._id}
                className={`bg-white border-l-4 ${
                  task.completed ? "border-green-500" : "border-red-500"
                } shadow-sm hover:shadow-lg transition rounded-xl p-6 space-y-3`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-blue-800">
                    {task.title}
                  </h2>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      task.completed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{task.description}</p>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-semibold text-blue-700">Due:</span>{" "}
                    <span className="inline-block text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md shadow-sm">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Created:
                    </span>{" "}
                    <span className="inline-block text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md shadow-sm">
                      {new Date(task.createdAt).toLocaleString()}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-purple-700">
                      Updated:
                    </span>{" "}
                    <span className="inline-block text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md shadow-sm">
                      {new Date(task.updatedAt).toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-yellow-400 text-white px-4 py-1 rounded-lg hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-6 gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-blue-800 font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg space-y-6 shadow-xl">
            <h2 className="text-2xl font-bold text-center text-blue-800">
              {isEditing ? "Edit Task" : "Add New Task"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Title"
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-blue-500"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-blue-500"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <input
                type="date"
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-blue-500"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required
              />
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.completed}
                  onChange={(e) =>
                    setForm({ ...form, completed: e.target.checked })
                  }
                />
                <label className="text-gray-700">Mark as Completed</label>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setEditId(null);
                  }}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  {isEditing ? "Update Task" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
