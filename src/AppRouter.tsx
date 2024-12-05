import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NotFoundPage from "./components/404/NotFoundPage";
import HomePage from "./pages/HomePage";
import PublicFeedPage from "./pages/PublicFeedPage";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Define your routes */}
        <Route path="/" element={<PublicFeedPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/feed" element={<PublicFeedPage />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
