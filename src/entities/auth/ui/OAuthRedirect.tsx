// src/pages/OAuthRedirect.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/"); // 메인 페이지로 이동
    } else {
      navigate("/login"); // 실패 시 로그인 페이지로
    }
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
};

export default OAuthRedirect;
