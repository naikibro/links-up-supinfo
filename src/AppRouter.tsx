import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "./pages/HomePage"; // Your main app
import NotFoundPage from "./components/404/NotFoundPage";
import HomePage from "./pages/HomePage";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Define your routes */}
        <Route path="/" element={<App />} />
        <Route path="/home" element={<HomePage />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
