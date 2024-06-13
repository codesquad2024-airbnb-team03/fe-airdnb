import React from "react";
import "./Home.css";
import MainPage from "./MainPage";

const Home = () => {
  return (
    <div>
      <header
        className="header"
        style={{
          padding: 16,
          fontSize: 30,
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="nav-logo">
          <a href="/">Airdnb</a>
        </div>
        <div className="nav-tab">
          <button className="login-button">로그인</button>
        </div>
      </header>
      <main className="content-main">
        <MainPage />
      </main>
    </div>
  );
};

export default Home;
