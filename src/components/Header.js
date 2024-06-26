// Header.js

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/default-profile.png";
import "./Header.css";

const Header = ({ user, handleLogout, openLoginModal, openRegisterModal, handleHostModeClick }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <div className="nav-tab-container" onClick={handleProfileClick} ref={profileRef}>
          <div className="hamburger-menu">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          <img src={user?.profileImg || defaultProfile} alt="Profile" className="profile-image" />
        </div>
      </div>
      {showMenu && (
        <div
          className="menu-container"
          ref={menuRef}
          style={{
            top: profileRef.current.getBoundingClientRect().bottom + window.scrollY + 10,
            left: profileRef.current.getBoundingClientRect().left + window.scrollX - 50,
          }}
        >
          {user ? (
            <>
              <button className="menu-button" onClick={handleHostModeClick}>
                호스트 페이지
              </button>
              <button className="menu-button" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button className="menu-button" onClick={openLoginModal}>
                로그인
              </button>
              <button className="menu-button" onClick={openRegisterModal}>
                회원 가입
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
