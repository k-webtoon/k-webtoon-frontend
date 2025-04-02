import axios from "axios";

const BASE_URL = 'http://localhost:8080/api/webtoon';

const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // 로컬 스토리지에서 JWT 토큰 가져오기
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 웹툰 좋아요
export const likeWebtoon = async (id: number) => {
    const response = await apiClient.post(
        `${BASE_URL}/like/${id}`,
        {}
    );
    return response.data;
};

// 웹툰 안좋아요(좋아요 취소) API
export const unlikeWebtoon = async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
        `${BASE_URL}/like/${id}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response.data;
};

// 웹툰 좋아요 목록 조회 API





