// ✅ File: FileUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const FileUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(`Selected file: ${e.target.files[0].name}`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setMessage(`Selected file: ${droppedFile.name}`);
    } else {
      setMessage('Please drop a valid PDF file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post(
        "https://digisign-backend-hmc0.onrender.com/api/docs/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setMessage(res.data.message);
      if (onUploadComplete) onUploadComplete();
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-indigo-600">
      <Navbar />

      {/* Desktop & Mobile Responsive Section */}
      <div className="flex flex-1 items-center justify-center px-4 sm:px-0">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 mx-auto"
        >
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-8 bg-indigo-50 cursor-pointer hover:shadow-md transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            <p className="text-gray-600 mb-2 text-center">Drag & Drop to Upload File</p>
            <p className="text-gray-500 mb-4 text-center">OR</p>
            <label className="inline-block bg-indigo-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-indigo-600">
              Browse File
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <button type="submit" className="mt-4 w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600">
            Upload
          </button>

          {message && <p className="mt-2 text-center text-sm text-gray-700">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default FileUpload;
