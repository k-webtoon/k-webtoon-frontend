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
    console.log("API 응답 데이터:", response.data); // 응답 데이터 확인

    return {
      ...response.data,
      profileImageUrl: response.data.profileImageUrl
        ? `${response.data.profileImageUrl}`
        : null, // 프로필 이미지가 없는 경우
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "프로필 정보 조회에 실패했습니다."
    );
  }
};

// 이미지만 가져오기
export const getUserProfileImageApi = async (userId: number) => {
  try {
    const response = await axios.get(
      `${USER_ACTIVITY_BASE_URL}/${userId}/profile-image`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.profileImageUrl
      ? `http://localhost:8080${response.data.profileImageUrl}`
      : null;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "프로필 이미지 조회 실패");
  }
};

// 소개 조회
export const getBioApi = async (userId: number): Promise<string> => {
  try {
    const response = await axios.get(`${USER_ACTIVITY_BASE_URL}/${userId}/bio`);
    console.log("response: ", response.data); // 여기에 바로 bio가 들어있음

    return response.data ?? "";
  } catch (error: any) {
    const message = error.response?.data?.message;
    if (message === "사용자 활동 정보 없음") return "";
    throw new Error(message || "소개 조회 실패");
  }
};

// 소개 수정
export const updateBioApi = async (bio: string) => {
  try {
    const response = await axios.put(
      `${USER_ACTIVITY_BASE_URL}/bio`,
      { bio },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "소개 업데이트 실패");
  }
};
