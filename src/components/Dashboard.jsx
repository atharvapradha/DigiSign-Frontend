import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchFiles = async () => {
    try {
      const res = await axios.get(
  "https://digisign-backend-hmc0.onrender.com/api/files",
  {
    withCredentials: true,
  }
);

      const data = Array.isArray(res.data) ? res.data : res.data.files || [];
      setFiles(data);
    } catch (err) {
      console.error('❌ Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`http://localhost:8000/api/files/${fileId}`, {
        withCredentials: true,
      });
      setFiles(files.filter((file) => file._id !== fileId));
    } catch (err) {
      console.error('❌ Error deleting file:', err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-sky-300 overflow-x-hidden">
      <h1 className="w-full bg-purple-600 text-white text-3xl font-bold py-3 px-4 text-center shadow-md">
        Dashboard
      </h1>

      <Navbar />

      <div className="flex-1 w-full max-w-[1600px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-600 text-lg">
              Loading files...
            </div>
          ) : files.length === 0 ? (
            <div className="col-span-full text-center text-gray-600 text-lg">
              No files uploaded yet
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file._id}
                className="bg-gray-200 text-black p-5 rounded-xl shadow-md hover:bg-gray-300 transition-colors duration-200"
              >
                <p className="font-semibold text-lg mb-1">{file.originalName}</p>
                <p className="text-sm mb-1">
                  Uploaded: {new Date(file.uploadDate).toLocaleString()}
                </p>
                <p className="text-sm font-semibold mb-4">
                  Status:{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded text-white ${
                      file.status === 'Signed'
                        ? 'bg-green-600'
                        : 'bg-yellow-500'
                    }`}
                  >
                    {file.status || 'Pending'}
                  </span>
                </p>

                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition mr-2"
                  onClick={() => navigate(`/sign/${file._id}`)} // ✅ Fixed routing
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  onClick={() => handleDelete(file._id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
