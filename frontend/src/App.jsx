import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Budgets from "./pages/Budgets";
import Home from "./pages/Home";

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const token = localStorage.getItem("token");

  const fetchAlerts = async () => {
    if (!token) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/budget/status`,
        {
          headers: { Authorization: token },
        }
      );
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchAlerts(); 

    const interval = setInterval(() => {
      fetchAlerts();
    }, 100); 
    return () => clearInterval(interval);
  }, [token]);
  return (
    <Router>
      <Navbar alerts={alerts} />
      <Routes>
        <Route path="/" element={token ? <Dashboard /> : <Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/budgets" element={<Budgets />} />
      </Routes>
    </Router>
  );
}
