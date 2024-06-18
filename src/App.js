import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginSuccess from "./pages/LoginSuccess";
import HostPage from "./pages/HostPage";
import FilteredResults from "./pages/FilteredResults";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginSuccess" element={<LoginSuccess />} />
        <Route path="/hosting" element={<HostPage />} />
        <Route path="/filteredResults" element={<FilteredResults />} />
      </Routes>
    </Router>
  );
};

export default App;