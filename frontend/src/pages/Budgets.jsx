import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Budgets() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ category: '', limit: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');

    fetchBudgets();
    fetchAlerts();
  }, []);

  const fetchBudgets = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/budget`, {
      headers: { Authorization: token },
    });
    const data = await res.json();
    setBudgets(data);
  };

  const fetchAlerts = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/budget/status`, {
      headers: { Authorization: token },
    });
    const data = await res.json();
    setAlerts(data);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    await fetch(`${import.meta.env.VITE_API_URL}/api/budget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ category, limit }),
    });

    setCategory('');
    setLimit('');
    fetchBudgets();
    fetchAlerts();
  };

  const startEdit = budget => {
    setEditingId(budget._id);
    setEditForm({ category: budget.category, limit: budget.limit });
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem('token');
    await fetch(`${import.meta.env.VITE_API_URL}/api/budget/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    fetchBudgets();
    fetchAlerts();
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleDelete = async id => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this budget?')) return;

    await fetch(`${import.meta.env.VITE_API_URL}/api/budget/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token },
    });

    fetchBudgets();
    fetchAlerts();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Set Monthly Budget Category-Wise</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <input
          type="text"
          placeholder="Category"
          className="border p-2 w-full border-gray-300 rounded"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Limit (₹)"
          className="border p-2 w-full border-gray-300 rounded"
          value={limit}
          onChange={e => setLimit(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded w-full"
        >
          Save Budget
        </button>
      </form>

      {alerts.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-8 mb-2 text-red-600">Alerts</h2>
          <ul className="list-disc pl-5">
            {alerts.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </>
      )}


      <h2 className="text-xl font-bold mt-8 mb-4">Your Budgets</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr className='text-center'>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Limit (₹)</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map(b => (
              <tr key={b._id} className="border-b text-sm text-center">
                {editingId === b._id ? (
                  <>
                    <td className="border px-4 py-2">
                      <input
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        name="limit"
                        type="number"
                        value={editForm.limit}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={handleEditSave}
                        className="px-2 py-1 bg-green-600 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="px-2 py-1 bg-gray-600 text-white rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border px-4 py-2">{b.category}</td>
                    <td className="border px-4 py-2">₹{b.limit}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => startEdit(b)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="px-2 py-1 bg-red-600 text-white rounded cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
