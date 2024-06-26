import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AccommodationDetail.css';
import Header from '../components/Header'; // Import the Header component
import API_BASE_URL from "../config";

const AccommodationDetail = () => {
  const { accommodationId } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [error, setError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchAccommodationDetail = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/accommodations/${accommodationId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setAccommodation(response.data);
        } catch (error) {
          console.error('Failed to fetch accommodation detail:', error);
        }
      }
    };

    fetchAccommodationDetail();
  }, [accommodationId]);

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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return 0;
    const days = (new Date(checkOut) - new Date(checkIn)) / (1000 * 3600 * 24);
    return accommodation.price * days;
  };

  const handleReserve = async () => {
    if (!checkIn || !checkOut || guestCount <= 0) {
      setError('모든 정보를 입력해주세요.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(checkIn) <= today) {
      setError('체크인 가능한 날짜가 아닙니다.');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('체크인 체크아웃 날짜가 올바르지 않습니다.');
      return;
    }

    const reservationData = {
      checkIn,
      checkOut,
      headCount: guestCount,
      userId: accommodation.userId,
      accommodationId: accommodation.id,
      createdAt: new Date().toISOString(),
    };

    const token = localStorage.getItem("jwtToken");

    try {
      await axios.post(`${API_BASE_URL}/reservations`, reservationData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('예약이 완료되었습니다.');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('이미 예약이 완료된 날짜입니다.');
      } else {
        setError('예약에 실패하였습니다. 다시 시도해주세요.');
      }
      console.error('Reservation failed:', error);
    }
  };

  if (!accommodation) {
    return <p>Loading...</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setUser(null);
    navigate("/");
  };

  const handleHostModeClick = () => {
    navigate("/hosting", { state: { user } });
  };

  return (
    <div>
      <Header
        user={user}
        handleLogout={handleLogout}
        openLoginModal={() => setShowLoginModal(true)}
        openRegisterModal={() => setShowRegisterModal(true)}
        handleHostModeClick={handleHostModeClick}
      />
      <div className="accommodation-detail-page">
        <div className="image-gallery">
          <img src={accommodation.profileImg} alt={accommodation.name} className="main-image" />
          <div className="thumbnail-images">
            {accommodation.images && accommodation.images.length > 0 ? (
              accommodation.images.map((img, index) => (
                <img src={img} alt={`thumbnail-${index}`} key={index} className="thumbnail-image" />
              ))
            ) : (
              <div className="thumbnail-placeholder"></div>
            )}
          </div>
        </div>
        <div className="content">
          <div className="details">
            <div className="accommodation-detail-info">
              <h2>{accommodation.name}</h2>
              <p className="accommodation-detail-info">{accommodation.address.firstAddress} {accommodation.address.secondAddress} {accommodation.address.thirdAddress}</p>
              <p className="accommodation-detail-info">최대 인원 {accommodation.maxHeadCount}명 · 침실 {accommodation.bedroomCount}개 · 침대 {accommodation.bedCount}개 · 욕실 {accommodation.bathroomCount}개</p>
              <div>
                <span className="star">⭐</span>
                <span><span className="grade-info">{accommodation.averageGrade.toFixed(2)}</span> · 후기 {accommodation.reviewCount}개</span>
              </div>
            </div>
            <hr className="divider" />
            <div className="host-info">
              <img src={accommodation.host.profileImg} alt="Host" className="host-profile-img" />
              <span>호스트: <span className="grade-info">{accommodation.host.name}</span> 님</span>
            </div>
            <hr className="divider" />
          </div>
          <div className="reservation-section-wrapper">
            <div className="reservation-section">
              <div className="price-info">
                <div className="price">₩{accommodation.price.toLocaleString()} / 박</div>
                <div className="reviews">(후기 {accommodation.reviewCount}개)</div>
              </div>
              <div className="date-info">
                <div className="accommodation-detail-check-in-out">
                  <div className="accommodation-detail-check">
                    <div className="label">체크인</div>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div className="accommodation-detail-check">
                    <div className="label">체크아웃</div>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>
                <div className="guests">
                  <div className="label">인원</div>
                  <input
                    type="number"
                    min="1"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                  />
                </div>
              </div>
              {error && <div className="error">{error}</div>}
              <button className="reserve-button" onClick={handleReserve}>예약하기</button>
              <div className="price-details">
                <div className="detail">
                  <div className="label">₩{accommodation.price.toLocaleString()} x {(new Date(checkOut) - new Date(checkIn)) / (1000 * 3600 * 24)}박</div>
                  <div className="value">₩{calculateTotalPrice().toLocaleString()}</div>
                </div>
                <div className="detail">
                  <div className="label">서비스 수수료</div>
                  <div className="value">₩{(calculateTotalPrice() * 0).toLocaleString()}</div>
                </div>
                <div className="detail">
                  <div className="label">청소비</div>
                  <div className="value">₩{(accommodation.price * 0).toLocaleString()}</div>
                </div>
                <div className="total">
                  <div className="label">총 합계</div>
                  <div className="value">₩{(calculateTotalPrice() + (calculateTotalPrice() * 0) + (accommodation.price * 0)).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="reviews-section">
          <hr className="divider" />
          <h2>★ {accommodation.averageGrade.toFixed(2)} · 후기 {accommodation.reviewCount}개</h2>
          <hr className="divider" />
          <div className="reviews-grid">
            {accommodation.reviews.map(review => (
              <div key={review.id} className="review">
                <img src={review.user.profileImg} alt={review.user.name} className="review-user-img" />
                <div className="review-content">
                  <div className="review-header">
                    <span className="review-user-name">{review.user.name}</span>
                  </div>
                  <div className="review-grade">
                    {Array.from({ length: Math.round(review.grade) }).map((_, i) => (
                      <span key={i} className="small-star">⭐</span>
                    ))}
                    <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p>{review.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetail;
