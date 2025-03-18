import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import WebtoonDetail from "./pages/WebtoonDetail.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/detail" element={<WebtoonDetail />} />
      </Routes>
    </Router>
  </StrictMode>
);
