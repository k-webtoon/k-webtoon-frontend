import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "@/entities/auth/model/userStore";
import { userApi } from "@/app/api/userApi";

const MyPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndRedirect = async () => {
      if (!isAuthenticated) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        // 1. 먼저 /me 엔드포인트로 현재 사용자 정보를 가져옴
        const userInfo = await userApi.getUserInfo();
        console.log("가져온 사용자 정보:", userInfo);

        if (!userInfo || !userInfo.indexId) {
          throw new Error("사용자 정보를 찾을 수 없습니다.");
        }

        // 2. 프로필 페이지로 리다이렉트
        navigate("/mypage/profile", {
          replace: true,
          state: { userInfo },
        });
        console.log("MyProfile 페이지로 이동합니다:", { userInfo, path: "/mypage/profile" });
      } catch (error: any) {
        console.error("마이페이지 접근 오류:", error);

        // 인증 관련 오류 처리
        if (error.response?.status === 401 || error.message.includes("인증")) {
          localStorage.removeItem("token");
          navigate("/login", {
            replace: true,
            state: { message: "다시 로그인해주세요." },
          });
          return;
        }

        setError(error.message || "사용자 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRedirect();
  }, [isAuthenticated, navigate]);

  // 로딩 상태 UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 비인증 상태 처리
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return null;
};

export default MyPage;
