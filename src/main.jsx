import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./ui/context/ThemeContext.jsx";
import { ToastProvider } from "./ui/context/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </ThemeProvider>,
);
