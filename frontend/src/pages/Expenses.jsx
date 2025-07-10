import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Expenses() {
  const navigate = useNavigate();
  const location = useLocation();

  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: '',
    category: '',
    date: '',
    paymentMethod: '',
    notes: '',
  });

  const queryParams = new URLSearchParams(location.search);
  const filterCategory = queryParams.get('category');

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');

    fetchExpenses();
  }, [location.search]);

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    let url = `${import.meta.env.VITE_API_URL}/api/expenses`;

    if (filterCategory) {
      url += `?category=${encodeURIComponent(filterCategory)}`;
    }

    const res = await fetch(url, {
      headers: { Authorization: token },
    });

    const data = await res.json();
    setExpenses(data);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ amount, category, date, paymentMethod, notes }),
    });

    alert('Expense added!');
    setAmount('');
    setCategory('');
    setDate('');
    setPaymentMethod('');
    setNotes('');
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      navigate('/login');
      return;
    }
  
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });
  
      if (!res.ok) {
        const err = await res.json();
        alert(`Failed to delete: ${err.msg || 'Server error'}`);
        return;
      }
  
      fetchExpenses();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Something went wrong.');
    }
  };
  

  const startEdit = expense => {
    setEditingId(expense._id);
    setEditForm({
      amount: expense.amount,
      category: expense.category,
      date: expense.date.slice(0, 10),
      paymentMethod: expense.paymentMethod,
      notes: expense.notes || '',
    });
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem('token');

    await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(editForm),
    });

    setEditingId(null);
    fetchExpenses();
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add Expense</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="number"
          placeholder="Amount"
          className="border p-2 w-full border-gray-300 rounded"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          className="border p-2 w-full border-gray-300 rounded"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        />
        <input
          type="date"
          className="border p-2 w-full border-gray-300 rounded"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Payment Method"
          className="border p-2 w-full border-gray-300 rounded"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
          required
        />
        <textarea
          placeholder="Notes"
          className="border p-2 w-full border-gray-300 rounded"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Expense
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">
        Previous Expenses {filterCategory && `(Filtered: ${filterCategory})`}
      </h2>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Payment</th>
                <th className="border px-4 py-2">Notes</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp._id} className="text-center">
                  {editingId === exp._id ? (
                    <>
                      <td className="border px-2 py-2">
                        <input
                          name="amount"
                          type="number"
                          value={editForm.amount}
                          onChange={handleEditChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="border px-2 py-2">
                        <input
                          name="category"
                          value={editForm.category}
                          onChange={handleEditChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="border px-2 py-2">
                        <input
                          name="date"
                          type="date"
                          value={editForm.date}
                          onChange={handleEditChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="border px-2 py-2">
                        <input
                          name="paymentMethod"
                          value={editForm.paymentMethod}
                          onChange={handleEditChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="border px-2 py-2">
                        <input
                          name="notes"
                          value={editForm.notes}
                          onChange={handleEditChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="border px-2 py-2 space-x-2">
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
                      <td className="border px-4 py-2">₹{exp.amount}</td>
                      <td className="border px-4 py-2">{exp.category}</td>
                      <td className="border px-4 py-2">
                        {new Date(exp.date).toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2">{exp.paymentMethod}</td>
                      <td className="border px-4 py-2">{exp.notes || '-'}</td>
                      <td className="border px-4 py-2 space-x-2">
                        <button
                          onClick={() => startEdit(exp)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(exp._id)}
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
      )}
    </div>
  );
}
