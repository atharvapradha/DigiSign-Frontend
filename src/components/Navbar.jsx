// ✅ File: Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <nav className="bg-gray-300 text-black w-full py-2 px-4 sm:px-10 shadow-lg">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <div className="flex items-center">
          <Link to="/upload">
            <h1 className="text-xl sm:text-2xl font-bold cursor-pointer">DigiSign</h1>
          </Link>
        </div>

        <ul className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 text-sm">
          <li>
            <Link to="/dashboard">
              <button className="bg-white text-black px-3 py-1.5 rounded hover:bg-gray-400 transition">
                Dashboard
              </button>
            </Link>
          </li>

          <li>
            <Link to="/upload">
              <button className="bg-white text-black px-3 py-1.5 rounded hover:bg-gray-400 transition">
                FileUpload
              </button>
            </Link>
          </li>

          <li>
            <Link to="/sign">
              <button className="bg-white text-black px-3 py-1.5 rounded hover:bg-gray-400 transition">
                Editor
              </button>
            </Link>
          </li>

          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
