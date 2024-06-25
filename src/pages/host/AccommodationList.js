// AccommodationList.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AccommodationList.css";
import API_BASE_URL from "../../config";

const AccommodationList = ({ onEdit, user }) => {
  const [accommodations, setAccommodations] = useState([]);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("JWT token is missing");
        }

        if (!user) {
          throw new Error("User is not defined");
        }

        console.log("Sending API request with token:", token);
        const response = await axios.get(
          `${API_BASE_URL}/accommodations/list/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API response:", response.data);
        setAccommodations(response.data);
      } catch (error) {
        console.error("Error fetching accommodations:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }
      }
    };

    fetchAccommodations();
  }, [user]);

  const isValidImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  return (
    <div className="accommodation-list-container">
      <h2>숙소 리스트</h2>
      <ul>
        {accommodations.map((accommodation) => (
          <li key={accommodation.id} className="accommodation-item">
            {accommodation.profileImg ? (
              <img
                src={accommodation.profileImg}
                alt={accommodation.name}
                className="accommodation-image"
                onError={(e) => {
                  e.target.onerror = null; // prevents looping
                  e.target.src = "default-image-url.jpg"; // 대체 이미지 URL
                }}
              />
            ) : (
              <img
                src="default-image-url.jpg"
                alt="default"
                className="accommodation-image"
              />
            )}
            <div className="accommodation-details">
              <h3>{accommodation.name}</h3>
              <p>
                {accommodation.address.firstAddress}{" "}
                {accommodation.address.secondAddress}{" "}
                {accommodation.address.thirdAddress}
              </p>
              <p className="accommodation-info">
                최대 인원: {accommodation.maxHeadCount}명
              </p>
              <p className="accommodation-info">
                침대: {accommodation.bedCount}, 침실:{" "}
                {accommodation.bedroomCount}, 욕실:{" "}
                {accommodation.bathroomCount}
              </p>
              <p className="accommodation-price">
                ₩{accommodation.price.toLocaleString()} / 박
              </p>
            </div>
            <div className="edit-button-container">
              <button
                className="edit-button"
                onClick={() => onEdit(accommodation.id)}
              >
                수정
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccommodationList;
