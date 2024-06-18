import React, { useState } from "react";
import axios from "axios";
import "./RegisterModal.css";
import API_BASE_URL from "../config"

const RegisterModal = ({ closeModal }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(null);

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    try {
      const response = await axios.post(API_BASE_URL + "/users", {
        name,
        password,
      });
      console.log("Registration successful:", response.data);
      closeModal();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);
  };

  return (
    <div className="modal-background">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2>회원 가입</h2>
        <form onSubmit={handleRegister}>
          <label>
            아이디:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            비밀번호:
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </label>
          <label>
            비밀번호 확인:
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </label>
          {passwordMatch === false && (
            <p className="error-message">비밀번호가 일치하지 않습니다.</p>
          )}
          {passwordMatch && (
            <p className="success-message">비밀번호가 일치합니다.</p>
          )}
          <button type="submit" disabled={passwordMatch === false}>
            회원 가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
