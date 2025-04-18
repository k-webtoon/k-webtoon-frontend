import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const adminLogStatsApi = {
  getDailyActiveUsers: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/stats/daily-active-users`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  },

  getRecent7DaysUsers: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/stats/recent-7days-users`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  },

  getRecent30DaysUsers: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/stats/recent-30days-users`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  },

  getMostVisitedWebtoonDetail: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/stats/most-visited-webtoon-detail`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  },

  getTop10Keywords: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/stats/top-keywords`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  },

  getPageDwellTimeStats: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/stats/page-dwell-time`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  },
};
