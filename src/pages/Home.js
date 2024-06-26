// Home.js

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Home.css";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import Filter from "../components/Filter";
import Footer from "./Footer";
import Main from "./Main";
import Header from "../components/Header"; // Header 컴포넌트 불러오기
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState({ latitude: 37.49082415564897, longitude: 127.03344781702127 });

  const navigate = useNavigate();

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setUser(null);
  };

  const handleHostModeClick = () => {
    navigate("/hosting", { state: { user } });
  };

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

  const applyFilters = async (filters) => {
    const { adults, children, infants } = filters.travelerCount;
    const capacity = adults + children + infants;

    try {
      const response = await axios.get(
        API_BASE_URL + "/accommodations/filter",
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
      <Header
        user={user}
        handleLogout={handleLogout}
        openLoginModal={openLoginModal}
        openRegisterModal={openRegisterModal}
        handleHostModeClick={handleHostModeClick}
      />
      <div className="background-image-container" />
      <main className="content-main">
        <Filter applyFilters={applyFilters} />
        <Main />
      </main>
      <Footer />

      {showLoginModal && <LoginModal closeModal={closeModal} />}
      {showRegisterModal && <RegisterModal closeModal={closeModal} />}
    </div>
  );
};

export default Home;
