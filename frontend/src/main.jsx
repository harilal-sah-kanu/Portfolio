import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-color)",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: "1px solid var(--toast-border)",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10b981",
              color: "#ffffff",
              border: "1px solid #059669",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#10b981",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#ef4444",
              color: "#ffffff",
              border: "1px solid #dc2626",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#ef4444",
            },
          },
          loading: {
            style: {
              background: "#3b82f6",
              color: "#ffffff",
              border: "1px solid #2563eb",
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
