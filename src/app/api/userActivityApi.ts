import axios from "axios";

const USER_ACTIVITY_BASE_URL = "http://localhost:8080/api/user-activity";

// 이미지 업로드 API
export const updateProfileImageApi = async (file: File) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  try {
    const response = await axios.put(
      `${USER_ACTIVITY_BASE_URL}/profile-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // 서버에서 반환한 파일명
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "프로필 이미지 업데이트 실패"
    );
  }
};

// 프로필 정보 조회 API
export const getUserActivityInfoApi = async (userId: number) => {
  try {
    const response = await axios.get(
      `${USER_ACTIVITY_BASE_URL}/${userId}/info`
    );
    return {
      ...response.data,
      profileImageUrl: `/img/${response.data.profileImagePath}`, // 프론트엔드 URL 생성
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "프로필 정보 조회에 실패했습니다."
    );
  }
};
