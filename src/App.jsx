import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import Signup from './components/Signup.jsx';
import Signin from './components/Signin.jsx';
import FileUpload from './components/FileUpload.jsx';
import Dashboard from './components/Dashboard.jsx';
import DigitalSigner from './components/DigitalSigner.jsx'; // ✅ Import the signer

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/upload" element={<FileUpload onUploadSuccess={handleUploadSuccess} />} />
        <Route path="/dashboard" element={<Dashboard key={refreshKey} />} />
        <Route path="/sign" element={<DigitalSigner />} /> {/* ✅ Added route without fileId */}
        <Route path="/sign/:fileId" element={<DigitalSigner />} /> {/* ✅ Existing dynamic route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
