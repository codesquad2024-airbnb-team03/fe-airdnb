import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // URLSearchParams를 사용하여 URL에서 토큰 파싱
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem("jwtToken", token);
      // 메인 페이지로 리디렉션
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div>
      <h2>Login Successful</h2>
      <p>Redirecting...</p>
    </div>
  );
};

export default LoginSuccess;
