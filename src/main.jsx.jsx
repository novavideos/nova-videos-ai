import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initializeApp } from "firebase/app";

// --- IMPORTANT ---
// PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
initializeApp({
  apiKey: "AIzaSyBhNuIgFMcCm10s8osuzT5NzZylEyWQQ9A",
  authDomain: "nova-videos-ai.firebaseapp.com",
  projectId: "nova-videos-ai",
  storageBucket: "nova-videos-ai.firebasestorage.app",
  messagingSenderId: "351189227529",
  appId: "1:351189227529:web:48031688cdd800148c80d8"
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)