import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";

const AccommodationList = ({ onEdit }) => {
  const [accommodations, setAccommodations] = useState([]);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("JWT token is missing");
        }

        console.log("Sending API request with token:", token);
        const response = await axios.get(
          API_BASE_URL + "/accommodations/list/1",
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
  }, []);

  return (
    <div className="accommodation-list-container">
      <h2>숙소 리스트</h2>
      <ul>
        {accommodations.map((accommodation) => (
          <li key={accommodation.id}>
            <h3>{accommodation.name}</h3>
            <p>
              {accommodation.address.firstAddress}{" "}
              {accommodation.address.secondAddress}{" "}
              {accommodation.address.thirdAddress}
            </p>
            <p>가격: {accommodation.price}</p>
            <button onClick={() => onEdit(accommodation.id)}>수정</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccommodationList;
