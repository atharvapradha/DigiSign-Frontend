import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validateUsername = (username) => /^[a-z0-9]+$/.test(username);
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      setMessage("❌ Username must contain only lowercase letters and numbers.");
      return;
    }
    if (!validateEmail(email)) {
      setMessage("❌ Only Gmail addresses are allowed.");
      return;
    }
    if (!validatePassword(password)) {
      setMessage(
        "❌ Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const res = await axios.post(
        "https://digisign-backend-hmc0.onrender.com/api/login",
        { email, password, username },
        { withCredentials: true }
      );

      // ✅ Save the token to localStorage
      localStorage.setItem("token", res.data.token);

      setMessage("✅ Login successful!");
      navigate("/upload");
    } catch (err) {
      console.error(err);
      setMessage("❌ Login failed. Check your credentials.");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-blue-100 p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-3xl font-semibold text-center mb-6 text-black">Sign In</h2>

        {message && (
          <p
            className={`text-center mb-4 ${
              message.includes("✅") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Signin;
