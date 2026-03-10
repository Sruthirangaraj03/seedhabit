import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { XPProvider } from "./context/XPContext";
import { HunterStatsProvider } from "./context/HunterStatsContext";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <XPProvider>
            <HunterStatsProvider>
              <App />
            </HunterStatsProvider>
          </XPProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
