import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FilteredResults.css';
import ReservationModal from '../components/ReservationModal';
import LoginModal from '../components/LoginModal';
import Header from '../components/Header'; // Import the Header component
import API_BASE_URL from "../config";

const regionCoordinates = {
  서울특별시: { latitude: 37.521876280109616, longitude: 126.98283081262012, mapLevel: 7 },
  경기도: { latitude: 37.35911630920982, longitude: 127.13620407074511, mapLevel: 9 },
  인천광역시: { latitude: 37.456056230920616, longitude: 126.70524091346415, mapLevel: 8 },
  대구광역시: { latitude: 35.871387892777264, longitude: 128.60180785897748, mapLevel: 8 },
  대전광역시: { latitude: 36.350541152209146, longitude: 127.3848348578405, mapLevel: 8 },
  강원도: { latitude: 37.562459120946635, longitude: 128.42898270848892, mapLevel: 11 },
  울산광역시: { latitude: 35.53960598692905, longitude: 129.31159823473124, mapLevel: 8 },
  부산광역시: { latitude: 35.179721719553264, longitude: 129.0750674304489, mapLevel: 8 }
};

const FilteredRegionResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { region } = location.state;
  const [accommodations, setAccommodations] = useState([]);
  const [currentPosition, setCurrentPosition] = useState({
    latitude: regionCoordinates[region].latitude,
    longitude: regionCoordinates[region].longitude
  });
  const [mapLevel, setMapLevel] = useState(regionCoordinates[region].mapLevel);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false); 
  const [user, setUser] = useState(null);

  const fetchRegionAccommodations = useCallback(async (region) => {
    try {
      const response = await axios.get(API_BASE_URL + "/accommodations/filter/region/" + region);
      setAccommodations(response.data);
    } catch (error) {
      console.error("Failed to fetch region accommodations:", error);
    }
  }, []);

  useEffect(() => {
    if (region) {
      fetchRegionAccommodations(region);
    }
  }, [region, fetchRegionAccommodations]);

  useEffect(() => {
    if (currentPosition.latitude && currentPosition.longitude) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false&libraries=services,clusterer,drawing`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          const mapContainer = document.getElementById('map');
          const mapOption = {
            center: new window.kakao.maps.LatLng(currentPosition.latitude, currentPosition.longitude),
            level: mapLevel
          };
          const map = new window.kakao.maps.Map(mapContainer, mapOption);

          accommodations.forEach((acc) => {
            const markerPosition = new window.kakao.maps.LatLng(acc.latitude, acc.longitude);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
              title: acc.name
            });
            marker.setMap(map);

            const overlayContent = document.createElement('div');
            overlayContent.className = 'customoverlay';
            overlayContent.innerHTML = `<h4>${acc.name}</h4><p>${acc.price.toLocaleString()}원</p>`;
            const customOverlay = new window.kakao.maps.CustomOverlay({
              position: markerPosition,
              content: overlayContent,
              yAnchor: 1
            });
            customOverlay.setMap(map);
          });

          window.kakao.maps.event.addListener(map, 'dragend', () => {
            const latlng = map.getCenter();
            const latitude = latlng.getLat();
            const longitude = latlng.getLng();
            setCurrentPosition({ latitude, longitude });
          });

          window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
            const level = map.getLevel();
            setMapLevel(level);
          });
        });
      };

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [currentPosition, accommodations, mapLevel]);

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

  const openReservationModal = (accommodation) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setSelectedAccommodation(accommodation);
    }
  };

  const closeReservationModal = () => {
    setSelectedAccommodation(null);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setUser(null);
    navigate("/");
  };

  const handleHostModeClick = () => {
    navigate("/hosting", { state: { user } });
  };

  const handleAccommodationDetailClick = (id) => {
    navigate(`/accommodation/${id}`);
  };

  return (
    <div className="filtered-results-wrapper">
      <Header
        user={user}
        handleLogout={handleLogout}
        openLoginModal={() => setShowLoginModal(true)}
        openRegisterModal={() => setShowRegisterModal(true)} 
        handleHostModeClick={handleHostModeClick}
      />
      <div className="filtered-results">
        <div className="accommodation-list">
          <div className="filter-summary">
            <span>{region}</span>
          </div>
          <ul>
            {accommodations.map((acc) => (
              <li key={acc.id} className="accommodation-item" onClick={() => openReservationModal(acc)}>
                <img src={acc.profileImg} alt={acc.name} />
                <div className="accommodation-details">
                  <h3>{acc.name}</h3>
                  <p>{acc.address.fullAddress}</p>
                  <p className="accommodation-info">최대 인원: {acc.maxHeadCount}명</p>
                  <p className="accommodation-info">침대: {acc.bedCount}, 침실: {acc.bedroomCount}, 욕실: {acc.bathroomCount}</p>
                  <p className="accommodation-price">₩{acc.price.toLocaleString()} / 박</p>
                  <div className="accommodation-rating-container">
                    <div className="accommodation-rating">
                      <span>⭐</span>
                      <span><span className="grade-info">{acc.averageGrade.toFixed(2)}</span> (리뷰 {acc.reviewCount}개)</span>
                    </div>
                    <span className="accommodation-detail-button" onClick={(e) => { e.stopPropagation(); handleAccommodationDetailClick(acc.id); }}>
                      숙소 상세보기
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="map-container">
          {currentPosition.latitude && currentPosition.longitude ? (
            <div id="map" style={{ width: '100%', height: '100%' }}></div>
          ) : (
            <p>현재 위치를 가져오는 중...</p>
          )}
        </div>
        {selectedAccommodation && (
          <ReservationModal
            accommodation={selectedAccommodation}
            closeModal={closeReservationModal}
            user={user}
          />
        )}
        {showLoginModal && <LoginModal closeModal={closeLoginModal} />}
      </div>
    </div>
  );
};

export default FilteredRegionResults;
