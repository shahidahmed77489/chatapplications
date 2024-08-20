import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatApp from "./components/ChatApp";
import UserPage from "./pages/UserPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserPage />} />
        <Route path="/chatDashboard" element={<ChatApp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
