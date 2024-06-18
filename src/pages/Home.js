import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Home.css";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import Filter from "../components/Filter";
import Footer from "./Footer";
import Main from "./Main";
import defaultProfile from "../assets/default-profile.png";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config"

const Home = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

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

  const handleHostModeClick = () => {
    navigate("/hosting");
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
          const response = await axios.get(API_BASE_URL + "/users", {
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  }, []);

  const applyFilters = async (filters) => {
    const { adults, children, infants } = filters.travelerCount;
    const capacity = adults + children + infants;

    try {
      const response = await axios.get(API_BASE_URL + "/accommodations/filter",
        {
          params: {
            checkIn: filters.checkIn,
            checkOut: filters.checkOut,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            capacity: capacity,
            currentLatitude: location.latitude,
            currentLongitude: location.longitude,
          },
        }
      );

      if (response.data.length > 0) {
        navigate("/filteredResults", {
          state: {
            accommodations: response.data,
            filters: { ...filters, capacity },
          },
        });
      } else {
        alert("검색 결과가 없습니다.");
      }
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  return (
    <div>
      <header className="header">
        <div
          className="nav-logo"
          style={{ fontSize: 30, alignItems: "center" }}
        >
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
      <main className="content-main">
        <Filter applyFilters={applyFilters} />
        <Main />
      </main>
      <Footer />

      {showMenu && (
        <div
          className="menu-container"
          ref={menuRef}
          style={{
            top:
              profileRef.current.getBoundingClientRect().bottom +
              window.scrollY +
              10,
            left:
              profileRef.current.getBoundingClientRect().left +
              window.scrollX -
              50,
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
