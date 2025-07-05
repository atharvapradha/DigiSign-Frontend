import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const validateUsername = (username) => /^[a-z0-9]+$/.test(username);
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = { name: "", username: "", email: "", password: "" };
    let hasError = false;

    if (!name.trim()) {
      newErrors.name = "❌ Name is required.";
      hasError = true;
    }

    if (!validateUsername(username)) {
      newErrors.username = `❌ Invalid username "${username}". Use only lowercase letters and numbers.`;
      hasError = true;
    }

    if (!validateEmail(email)) {
      newErrors.email = `❌ Invalid email "${email}". Only Gmail addresses allowed.`;
      hasError = true;
    }

    if (!validatePassword(password)) {
      newErrors.password =
        "❌ Password must be at least 8 characters with uppercase, lowercase, number, and special character.";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    try {
      await axios.post("http://localhost:8000/api/register", {
        name,
        username,
        email,
        password,
      });

      setMessage("✅ Registration successful! Redirecting...");
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setErrors({ name: "", username: "", email: "", password: "" });

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      console.error(err);

      if (err.response && err.response.status === 409) {
        setMessage("❌ Account already exists. Please sign in.");
      } else {
        setMessage("❌ Registration failed. Try again.");
      }
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-900">
          Sign Up
        </h2>

        {message && (
          <p
            className={`text-center mb-4 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 rounded p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 p-1 text-gray-600 hover:text-blue-600"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 3.172a.75.75 0 011.06 0L10 8.94l5.768-5.768a.75.75 0 111.06 1.06L11.06 10l5.768 5.768a.75.75 0 01-1.06 1.06L10 11.06l-5.768 5.768a.75.75 0 01-1.06-1.06L8.94 10 3.172 4.232a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zM10 15a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>

        <hr className="my-4 border-gray-300" />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
