import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginSuccess from "./pages/LoginSuccess";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginSuccess" element={<LoginSuccess />} />
      </Routes>
    </Router>
  );
};

export default App;
