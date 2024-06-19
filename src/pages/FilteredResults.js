import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './FilteredResults.css';  // CSS 파일 임포트
import useDebounce from '../hooks/useDebounce';  // useDebounce 훅 임포트
import API_BASE_URL from "../config"

const FilteredResults = () => {
  const location = useLocation();
  const { filters, accommodations: initialAccommodations } = location.state;
  const [accommodations, setAccommodations] = useState(initialAccommodations);

    // <사용자의 현재 위치 조회, HTTPS에서만 가능>
  // const [currentPosition, setCurrentPosition] = useState({latitude: null, longitude: null});
  const [currentPosition, setCurrentPosition] = useState({ latitude: 37.49082415564897, longitude: 127.03344781702127 }); // <수정>: 위치를 특정 위도와 경도로 설정


  const debouncedPosition = useDebounce(currentPosition, 500); // 500ms 디바운스 적용

  const fetchFilteredAccommodations = useCallback(async (latitude, longitude) => {
    try {
      const response = await axios.get(API_BASE_URL + "/accommodations/filter", {
        params: {
          currentLatitude: latitude,
          currentLongitude: longitude,
          checkIn: filters.checkIn,
          checkOut: filters.checkOut,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          capacity: filters.capacity
        }
      });
      setAccommodations(response.data);
    } catch (error) {
      console.error("Failed to fetch filtered accommodations:", error);
    }
  }, [filters]);

    // <사용자의 현재 위치 조회, HTTPS에서만 가능>
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setCurrentPosition({ latitude, longitude });
  //         fetchFilteredAccommodations(latitude, longitude);
  //       },
  //       (error) => {
  //         console.error("Error fetching location:", error);
  //       }
  //     );
  //   }
  // }, [fetchFilteredAccommodations]);

  useEffect(() => {
    if (debouncedPosition.latitude && debouncedPosition.longitude) {
      fetchFilteredAccommodations(debouncedPosition.latitude, debouncedPosition.longitude);
    }
  }, [debouncedPosition, fetchFilteredAccommodations]);

  useEffect(() => {
    if (currentPosition.latitude && currentPosition.longitude) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false&libraries=services,clusterer,drawing`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        // 쿠키 설정 추가
        document.cookie = "name=value; SameSite=None; Secure";
        
        window.kakao.maps.load(() => {
          const mapContainer = document.getElementById('map');
          const mapOption = {
            center: new window.kakao.maps.LatLng(currentPosition.latitude, currentPosition.longitude),
            level: 5
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
            overlayContent.innerHTML = `
              <h4>${acc.name}</h4>
              <p>${acc.price.toLocaleString()}원</p>
            `;

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
        });
      };

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [currentPosition, accommodations]);

  return (
    <div className="filtered-results">
      <div className="accommodation-list">
        <div className="filter-summary">
          <span>{filters.checkIn}<br></br>{filters.checkOut}</span>
          <span>|</span>
          <span>{filters.minPrice.toLocaleString()}원 - {filters.maxPrice.toLocaleString()}원</span>
          <span>|</span>
          <span>게스트 {filters.capacity}명</span>
        </div>
        <ul>
          {accommodations.map((acc) => (
            <li key={acc.id} className="accommodation-item">
              <img src={acc.profileImg} alt={acc.name} />
              <div className="accommodation-details">
                <h3>{acc.name}</h3>
                <p>{acc.address.fullAddress}</p>
                <p>최대 인원: {acc.maxHeadCount}명</p>
                <p>침대: {acc.bedCount}, 침실: {acc.bedroomCount}, 욕실: {acc.bathroomCount}</p>
                <p className="accommodation-price">{acc.price.toLocaleString()}원 / 박</p>
                <div className="accommodation-rating">
                  <span>⭐</span>
                  <span>{acc.averageGrade} ({acc.reviewCount} 리뷰)</span>
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
    </div>
  );
};

export default FilteredResults;
