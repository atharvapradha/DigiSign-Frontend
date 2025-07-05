# 🖋️ DigiSign Frontend

This is the **frontend client** for **DigiSign**, a MERN stack application that allows users to digitally sign PDF files. The frontend is built using **React.js** and **Vite**, offering fast performance and modular code structure.

It enables users to register, sign in, upload PDF files, drag-drop a signature onto the file, and download the signed version. It communicates with the backend via Axios-based API calls.


## 🌐 Live Demo (Optional)

> You can include this if deployed on Vercel or Netlify  
**🔗 

## 📁 Project Structure

frontend/
├── dist/                  # Production build output (auto-generated)
├── node_modules/          # Project dependencies
├── public/                # Static assets (e.g., favicon, robots.txt)
├── src/                   # Source code
│   ├── assets/            # Images, icons, logos
│   ├── components/        # Reusable React components
│   ├── pages/             # Page components like Dashboard, Signin
│   ├── styles/            # CSS or Tailwind custom styles
│   ├── utils/             # Utility/helper functions
│   ├── App.css            # App-level styles
│   ├── App.jsx            # Root component with routes
│   ├── index.css          # Global CSS
│   └── main.jsx           # Main React DOM entry point
├── .gitignore             # Ignored files for Git
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template used by Vite
├── package.json           # Project metadata and scripts
├── package-lock.json      # Locked dependency versions
├── vite.config.js         # Vite bundler config
└── README.md              # Project documentation

## 🚀 Features

- 👤 User Authentication (Signup/Login)
- 📄 PDF File Upload Interface
- ✍️ Drag-and-Drop Signature Placement
- 📌 Signature Positioning via Mouse Coordinates
- 💾 Save Changes & Send Data to Backend
- 📥 Download Signed PDF
- 📊 Dashboard View with File Status
- ⚡ Fast performance with Vite + TailwindCSS

## ⚙️ Tech Stack

- **React.js** (with Hooks and Functional Components)
- **Vite** for bundling
- **React Router DOM** for client-side routing
- **Axios** for API calls
- **TailwindCSS** for styling
- **react-pdf** for PDF rendering
- **react-dnd** or **react-draggable** for drag-drop signature
- **PDF-lib** (via backend) to embed the signature

## Repository
git clone https://github.com/atharvapradha/DigiSign-Frontend.git

## 🔁 Routing Overview

| Path            | Component           | Description                  |
| --------------- | ------------------- | ---------------------------- |
| `/`             | `Signin.jsx`        | Login screen                 |
| `/signup`       | `Signup.jsx`        | Registration screen          |
| `/dashboard`    | `Dashboard.jsx`     | List of uploaded files       |
| `/upload`       | `FileUpload.jsx`    | Upload PDF                   |
| `/sign/:fileId` | `DigitalSigner.jsx` | Drag-drop and save signature |


## 📌 How the App Works(App Flow)
1.User logs in or signs up.

2.Uploads a PDF file → sends it to the backend.

3.Opens the file in /sign/:fileId route.

4.Drags a signature to a position on the PDF.

5.Clicks Save Changes → signature data is sent to backend.

6.Backend saves the updated PDF and sets status to "Signed".

7.Dashboard reflects the status in real time.

## 👨‍💻 Author
Atharva Pradhan
🔗 https://github.com/atharvapradha