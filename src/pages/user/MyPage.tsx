import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "@/entities/auth/model/userStore.ts";
import { userApi } from "@/app/api/userApi.ts";

const MyPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 로그인 상태가 아니면 리다이렉트
    if (!isAuthenticated) {
      return;
    }

    async function fetchUserData() {
      try {
        console.log("토큰 확인:", localStorage.getItem("token"));

        // 현재 사용자 정보 가져오기
        const userInfo = await userApi.getUserInfo();
        console.log("가져온 사용자 정보:", userInfo);

        if (userInfo && userInfo.indexId) {
          console.log("리다이렉트 시도:", `/user/${userInfo.indexId}/profile`);
          setUserId(userInfo.indexId);
          navigate(`/user/${userInfo.indexId}/profile`, { replace: true });
        } else {
          console.error("사용자 정보에 indexId가 없음:", userInfo);
          setError("사용자 ID를 가져올 수 없습니다.");
        }
      } catch (err) {
        console.error("사용자 정보 가져오기 실패 상세:", err);
        setError("사용자 정보를 가져오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [isAuthenticated, navigate]);

  // 로그인 상태가 아니면 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // 로딩 중이거나 에러가 있는 경우
  return (
    <div className="p-8 text-center">
      <p>마이페이지로 이동 중...</p>
      {loading && (
        <p className="mt-2 text-sm text-gray-500">
          사용자 정보를 불러오는 중...
        </p>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {userId && (
        <p className="mt-2 text-sm text-gray-500">사용자 ID: {userId}</p>
      )}
    </div>
  );
};

export default MyPage;
