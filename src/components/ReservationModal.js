import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReservationModal.css';
import API_BASE_URL from '../config';

const ReservationModal = ({ accommodation, closeModal, user }) => {
  const [checkIn, setCheckIn] = useState(accommodation.initialCheckIn || '');
  const [checkOut, setCheckOut] = useState(accommodation.initialCheckOut || '');
  const [guestCount, setGuestCount] = useState(accommodation.initialGuestCount || 1);
  const [error, setError] = useState('');

  useEffect(() => {
    setGuestCount(accommodation.initialGuestCount);
  }, [accommodation.initialGuestCount]);

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
    today.setHours(0, 0, 0, 0); // 현재 날짜의 시간을 00:00:00으로 설정

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
      userId: user.id,
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
      closeModal();
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

  return (
    <div className="modal-background">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>×</span>
        <h2 className="accommodation-name">{accommodation.name}</h2>
        <div className="price-info">
          <div className="price">₩{accommodation.price.toLocaleString()} / 박</div>
          <div className="reviews">(후기 {accommodation.reviewCount}개)</div>
        </div>
        <div className="date-info">
          <div className="check-in-out">
            <div className="check">
              <div className="label">체크인</div>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="check">
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
  );
};

export default ReservationModal;
