import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Header.css";

const Header = ({ user, handleProfileClick, profileRef, defaultProfile }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleHostModeClick = () => {
    navigate("/hosting");
  };

  return (
    <header className="header">
      <div className="nav-logo" style={{ fontSize: 30, alignItems: "center" }}>
        <a href="/">Airdnb</a>
      </div>
      <nav className="navigation">
        <ul>
          <li>숙소</li>
          <li>체험</li>
          <li>온라인 체험</li>
        </ul>
      </nav>
      <div className="profile-container">
        <div className="host-mode-switch" onClick={handleHostModeClick}>
          호스트 모드로 전환
        </div>
        {user && <span className="user-name">{user.name}님</span>}
        <div
          className="nav-tab-container"
          onClick={handleProfileClick}
          ref={profileRef}
        >
          <div className="hamburger-menu">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          <img
            src={user?.profileImg || defaultProfile}
            alt="Profile"
            className="profile-image"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
