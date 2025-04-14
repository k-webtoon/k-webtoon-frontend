import axios from "axios";

const BASE_URL = 'http://localhost:8080/api/webtoons/reviews';

const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 사용자의 웹툰 좋아요 목록 조회 API
export const getUserLikedWebtoons = async (userId: number) => {
    const url = `${BASE_URL}/${userId}/likes`;

    const response = await axios.get(url);
    return response.data;
};

// 특정 웹툰 좋아요 API
export const toggleWebtoonLike = async (webtoonId: number) => {
    const response = await apiClient.post(
        `${BASE_URL}/${webtoonId}/like`,
        {}
    );
    return response.data;
};