import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.jpg';
import { BellIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Navbar({ alerts = [] }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/');
    } 
  };

  const toggleAlerts = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-4 flex justify-between items-center relative">
      {/* Logo */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={handleLogoClick}
      >
        <img src={Logo} alt="Logo" className="h-8 w-8 rounded" />
        <span className="font-bold hidden sm:inline">Personal Finance Tracker</span>
      </div>

      {/* RIGHT SIDE: bell + desktop menu + hamburger */}
      <div className="flex items-center space-x-4">
        {/* Bell icon - always visible when logged in & has alerts */}
        {token && (
          <div className="relative">
            <button onClick={toggleAlerts} className="relative flex items-center justify-center">
              <BellIcon className="h-6 w-6 text-white cursor-pointer" />
              {alerts.length > 0 && (<span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>)}
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded p-4 z-50">
                <h3 className="font-bold mb-2">Alerts</h3>
                <ul className="space-y-1">
                  {alerts.map((alert, idx) => (
                    <li key={idx} className="text-sm border-b pb-1">
                      {alert}
                    </li>
                  ))}
                </ul>
                {alerts.length === 0 && <p className="text-sm">No alerts.</p>}
              </div>
            )}
          </div>
        )}

        {/* Desktop links */}
        <div className="hidden md:flex space-x-4 items-center">
          {token ? (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/expenses" className="hover:underline">Expenses</Link>
              <Link to="/budgets" className="hover:underline">Budgets</Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-red-700 px-3 py-1 rounded hover:bg-red-800 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-red-700 px-3 py-1 rounded hover:bg-red-800 transition duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex items-center focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? (
            <XMarkIcon className="h-6 w-6 text-white" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-800 text-white p-4 flex flex-col space-y-2 md:hidden z-50">
          {token ? (
            <>
              <Link to="/dashboard" className="hover:underline" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/expenses" className="hover:underline" onClick={() => setMenuOpen(false)}>Expenses</Link>
              <Link to="/budgets" className="hover:underline" onClick={() => setMenuOpen(false)}>Budgets</Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-red-700 px-3 py-1 rounded hover:bg-red-800 transition duration-300"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-red-700 px-3 py-1 rounded hover:bg-red-800 transition duration-300"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
