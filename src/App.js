import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginSuccess from "./pages/LoginSuccess";
import HostPage from "./pages/host/HostPage";
import FilteredResults from "./pages/FilteredResults";
import AccommodationDetail from "./pages/AccommodationDetail"; 
import FilteredRegionResults from "./pages/FilteredRegionResults";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginSuccess" element={<LoginSuccess />} />
        <Route path="/hosting" element={<HostPage />} />
        <Route path="/filteredResults" element={<FilteredResults />} />
        <Route path="/filteredRegionResults" element={<FilteredRegionResults />} />
        <Route path="/accommodation/:accommodationId" element={<AccommodationDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
