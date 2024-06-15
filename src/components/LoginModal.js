import React, { useState } from "react";
import axios from "axios";
import "./LoginModal.css";

const LoginModal = ({ closeModal }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(""); // Clear previous error
    try {
      const response = await axios.post("http://localhost:8080/authenticate", {
        name: username,
        password,
      });
      if (response.data.token) {
        // Save JWT token to local storage
        localStorage.setItem("jwtToken", response.data.token);
        // Close modal and redirect to the main page
        closeModal();
        window.location.href = "/"; // Redirect to the main page
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login failed:", error);
    }
  };

  const handleGithubLogin = () => {
    // GitHub OAuth 로그인 페이지로 리다이렉션
    window.location.href = "http://localhost:8080/login/oauth/github";
  };

  return (
    <div className="modal-background">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Login</button>
        </form>
        <button className="github-login" onClick={handleGithubLogin}>
          <span className="github-icon" />
          Login with GitHub
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
