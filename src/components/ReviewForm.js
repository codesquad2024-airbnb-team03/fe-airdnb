import React, { useState } from 'react';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import API_BASE_URL from "../config";
import './ReviewForm.css';

const ReviewForm = ({ accommodationId, onReviewSubmit, user }) => {
  const [content, setContent] = useState('');
  const [grade, setGrade] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (grade < 1 || grade > 5 || content.trim() === '') {
      setError('모든 필드를 올바르게 입력해주세요.');
      return;
    }

    const token = localStorage.getItem("jwtToken");

    const reviewData = {
      content,
      grade,
      userId: user.id,  // userId 추가
      accommodationId
    };

    try {
      await axios.post(`${API_BASE_URL}/reviews`, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('리뷰가 성공적으로 작성되었습니다.');
      onReviewSubmit();
      setContent('');
      setGrade(0);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert('예약한 숙소에만 리뷰를 작성할 수 있습니다.');
      } else {
        setError('리뷰 작성에 실패하였습니다. 다시 시도해주세요.');
      }
      console.error('Review submission failed:', error);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="user-info">
        <img src={user.profileImg} alt={user.name} className="user-profile-img" />
        <span className="user-name">{user.name}</span>
      </div>
      <div className="form-group">
        <ReactStars
          count={5}
          value={grade}
          onChange={(newRating) => setGrade(newRating)}
          size={24}
          activeColor="#ffd700"
        />
      </div>
      <div className="form-group">
        <textarea
          id="content"
          placeholder="리뷰 내용을 작성해주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="3"
        />
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit" className="submit-button-review">리뷰 제출</button>
    </form>
  );
};

export default ReviewForm;
