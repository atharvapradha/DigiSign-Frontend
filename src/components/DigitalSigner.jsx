// ✅ File: DigitalSigner.jsx
import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChromePicker } from 'react-color';
import Draggable from 'react-draggable';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url';

import '../styles/AnnotationLayer.css';
import '../styles/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

function DigitalSigner() {
  const { fileId } = useParams();
  const [numPages, setNumPages] = useState(null);
  const [signature, setSignature] = useState('');
  const [fontStyle, setFontStyle] = useState('Helvetica');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#000');
  const [showPicker, setShowPicker] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 100, y: 100 });
  const [file, setFile] = useState(null);
  const [selectedPage] = useState(0);
  const [signaturePlaced, setSignaturePlaced] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const nodeRef = useRef(null);
  const previewRef = useRef(null);

  const handleDrag = (e, data) => {
    setDragPosition({ x: data.x, y: data.y });
    setSignaturePlaced(true);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleSubmit = async () => {
    if (!file || !signature || !signaturePlaced) {
      return alert("Upload a PDF, enter signature, and drag it to the PDF");
    }

    if (!fileId) {
      alert("❌ File ID missing. Cannot update status.");
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('signature', signature);
    formData.append('x', dragPosition.x);
    formData.append('y', dragPosition.y);
    formData.append('page', selectedPage);
    formData.append('color', textColor);
    formData.append('fontStyle', fontStyle);
    formData.append('fontSize', fontSize);
    formData.append('fileId', fileId);

    try {
      const res = await axios.post(
        "https://digisign-backend-hmc0.onrender.com/api/sign",
        formData,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'signed-document.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("❌ Submit Error:", err);
      alert('Failed to sign PDF');
    }
  };

  const handleSave = async () => {
    if (!file || !signature || !signaturePlaced) {
      return alert("Upload a PDF, enter signature, and drag it to the PDF");
    }

    if (!fileId) {
      alert("❌ File ID missing. Cannot update status.");
      return;
    }

    const pageElement = document.querySelector('.react-pdf__Page');
    const pageHeight = pageElement?.getBoundingClientRect().height || 0;
    const adjustedY = pageHeight - dragPosition.y;

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('signature', signature);
    formData.append('x', dragPosition.x);
    formData.append('y', adjustedY);
    formData.append('page', selectedPage);
    formData.append('color', textColor);
    formData.append('fontStyle', fontStyle);
    formData.append('fontSize', fontSize);
    formData.append('fileId', fileId);

    try {
      const res = await axios.post(
        'https://digisign-backend-hmc0.onrender.com/api/sign',
        formData,
        {
          responseType: 'blob',
          withCredentials: true,
        }
      );

      const newFile = new File([res.data], 'signed.pdf', { type: 'application/pdf' });
      setFile(newFile);
      setIsSaved(true);
    } catch (err) {
      console.error("❌ Failed to save signed PDF:", err);
      alert('Failed to save signed PDF');
    }
  };

  const handleDeleteSignature = () => {
    setSignature('');
    setSignaturePlaced(false);
    setDragPosition({ x: 100, y: 100 });
    setIsSaved(false);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-auto min-h-screen bg-gray-50">
      {/* PDF Viewer Panel (Desktop & Mobile Responsive) */}
      <div className="w-full md:w-2/3 overflow-auto p-4 bg-white border-b md:border-b-0 md:border-r border-gray-200">
        {!file ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-lg font-medium">
            Upload a PDF to start signing
          </div>
        ) : (
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <div className="relative mb-6" key={index}>
                <Page pageNumber={index + 1} width={window.innerWidth > 768 ? 600 : 320} />
                {signature && signaturePlaced && index === selectedPage && (
                  !isSaved ? (
                    <Draggable
                      position={dragPosition}
                      onDrag={handleDrag}
                      bounds="parent"
                      nodeRef={nodeRef}
                    >
                      <div
                        ref={nodeRef}
                        className="absolute z-10"
                        style={{
                          color: textColor,
                          fontFamily: fontStyle,
                          fontSize: `${fontSize}px`,
                          cursor: 'move',
                          userSelect: 'none',
                          backgroundColor: 'transparent',
                        }}
                      >
                        {signature}
                      </div>
                    </Draggable>
                  ) : (
                    <div
                      className="absolute z-10"
                      style={{
                        top: `${dragPosition.y}px`,
                        left: `${dragPosition.x}px`,
                        color: textColor,
                        fontFamily: fontStyle,
                        fontSize: `${fontSize}px`,
                        userSelect: 'none',
                        backgroundColor: 'transparent',
                        position: 'absolute',
                      }}
                    >
                      {signature}
                    </div>
                  )
                )}
              </div>
            ))}
          </Document>
        )}
      </div>

      {/* Control Panel (Desktop & Mobile Responsive) */}
      <div className="w-full md:w-1/3 p-6 sm:p-8 bg-gray-100 border-t md:border-t-0 md:border-l border-gray-300 space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">🖋️ Sign PDF</h2>

        {/* Signature Controls */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600 font-medium">Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setSignaturePlaced(false);
              setIsSaved(false);
            }}
            className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600 font-medium">Signature Text</label>
          <input
            type="text"
            placeholder="Enter your signature"
            value={signature}
            onChange={(e) => {
              setSignature(e.target.value);
              setSignaturePlaced(false);
              setIsSaved(false);
            }}
            className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600 font-medium">Font Style</label>
          <select
            value={fontStyle}
            onChange={(e) => {
              setFontStyle(e.target.value);
              setSignaturePlaced(false);
              setIsSaved(false);
            }}
            className="w-full px-4 py-2 border rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Helvetica">Helvetica</option>
            <option value="Courier">Courier</option>
            <option value="Times-Roman">Times-Roman</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600 font-medium">Font Size</label>
          <input
            type="number"
            min="10"
            max="100"
            value={fontSize}
            onChange={(e) => {
              setFontSize(Number(e.target.value));
              setSignaturePlaced(false);
              setIsSaved(false);
            }}
            className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600 font-medium">Signature Color</label>
          <div
            className="w-full h-10 rounded border cursor-pointer"
            style={{ backgroundColor: textColor }}
            onClick={() => setShowPicker(!showPicker)}
          />
          {showPicker && (
            <ChromePicker
              color={textColor}
              onChange={(color) => {
                setTextColor(color.hex);
                setSignaturePlaced(false);
                setIsSaved(false);
              }}
            />
          )}
        </div>

        {signature && !isSaved && (
          <div>
            <label className="text-sm text-gray-600 font-medium">Drag Signature Below to PDF</label>
            <Draggable
              bounds="body"
              nodeRef={previewRef}
              onStop={(e, data) => {
                setDragPosition({ x: data.x, y: data.y });
                setSignaturePlaced(true);
              }}
            >
              <div
                ref={previewRef}
                className="mt-2 p-2 text-center rounded cursor-move w-fit border border-dashed border-gray-400"
                style={{
                  fontFamily: fontStyle,
                  color: textColor,
                  fontSize: `${fontSize}px`,
                  userSelect: 'none',
                  backgroundColor: 'transparent',
                }}
              >
                {signature}
              </div>
            </Draggable>
          </div>
        )}

        <p className="text-xs text-gray-500 italic">
          Drag your signature to the correct location on the PDF page.
        </p>

        {/* Button Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDeleteSignature}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded shadow"
          >
            Delete Signature
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded shadow"
          >
            Submit & Download
          </button>

          <button
            onClick={handleSave}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded shadow"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default DigitalSigner;