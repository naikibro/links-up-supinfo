import React, { useState } from "react";
import NotFoundPage from "./components/404/NotFoundPage";
import HomePage from "./pages/HomePage";
import PublicFeedPage from "./pages/PublicFeedPage";
import Navbar from "./components/navbar/Navbar";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>("feed");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "feed":
        return <PublicFeedPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div>
      {/* Render the current page */}
      <main>
        <Navbar setCurrentPage={setCurrentPage} />
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
