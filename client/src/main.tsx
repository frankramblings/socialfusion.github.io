import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Mock the window.tc environment for development
if (typeof window.tc === 'undefined') {
  window.tc = {
    env: {
      serverUrl: "https://www.transparentclassroom.com",
      currentSchoolId: 6862,
      currentSchoolName: "Little Tree Education - Newmarket",
      currentSchoolLogo: "https://s3.amazonaws.com/transparentclassroom.com/schools/6862/2025/schools/dcb414666dfe250f84996cf6936bb4485d0c69679a06db591fca950d9de5847b.square.png"
    }
  };
}

createRoot(document.getElementById("root")!).render(<App />);

// Add type definition for window.tc
declare global {
  interface Window {
    tc: {
      env: {
        serverUrl: string;
        currentSchoolId: number;
        currentSchoolName: string;
        currentSchoolLogo: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
  }
}
