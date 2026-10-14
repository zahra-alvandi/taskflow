import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./ui/context/ThemeContext.jsx";
import { ToastProvider } from "./ui/context/ToastContext.jsx";
import { ModalProvider } from "./ui/context/ModalContext.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <ToastProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </ToastProvider>
  </ThemeProvider>,
);
