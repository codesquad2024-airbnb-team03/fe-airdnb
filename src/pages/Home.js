import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Home.css";
import MainPage from "./MainPage";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import Filter from "../components/Filter";
import defaultProfile from "../assets/default-profile.png";

const Home = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);

  const menuRef = useRef(null);
  const profileRef = useRef(null);

  const handleProfileClick = () => {
    setShowMenu(!showMenu);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowMenu(false);
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
    setShowMenu(false);
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
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

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setUser(null);
    setShowMenu(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          const response = await axios.get("http://localhost:8080/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };
    fetchUserProfile();
  }, []);

  const applyFilters = (filters) => {
    console.log("Applied filters:", filters);
    // 필터 적용 로직 추가
  };

  return (
    <div>
      <header
        className="header"
        style={{
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
        <div className="profile-container">
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
      <main className="content-main">
        <Filter applyFilters={applyFilters} />
        <MainPage />
      </main>

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
            <button className="menu-button" onClick={handleLogout}>
              로그아웃
            </button>
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

      {showLoginModal && <LoginModal closeModal={closeModal} />}
      {showRegisterModal && <RegisterModal closeModal={closeModal} />}
    </div>
  );
};

export default Home;
