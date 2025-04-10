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

// 사용자의 좋아요 목록 조회 API
export const fetchUserLikes = async (userId?: number) => {
    const url = userId
        ? `${BASE_URL}/${userId}/likes`
        : `${BASE_URL}/me/likes`;

    const response = await apiClient.get(url);
    return response.data;
};

// 특정 웹툰 좋아요 API
export const webtoonLike = async (id: number) => {
    const response = await apiClient.post(
        `${BASE_URL}/${id}/like`,
        {}
    );
    return response.data;
};