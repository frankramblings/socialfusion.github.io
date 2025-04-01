import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(() => {
      console.log('ServiceWorker registered successfully');
    }).catch(error => {
      console.error('ServiceWorker registration failed: ', error);
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
