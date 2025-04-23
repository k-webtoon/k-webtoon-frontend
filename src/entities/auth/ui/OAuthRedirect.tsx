import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 쿠키에서 Access Token을 가져오는 함수
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const accessToken = getCookie("accessToken"); // 쿠키에서 accessToken을 읽기

    if (accessToken) {
      localStorage.setItem("token", accessToken); // 로컬 스토리지에 저장
      navigate("/"); // 메인 페이지로 이동
    } else {
      navigate("/login"); // 실패 시 로그인 페이지로
    }
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
};

export default OAuthRedirect;
