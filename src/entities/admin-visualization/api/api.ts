import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // 실제 주소로 교체 필요 시 변경


// PCA 데이터 요청
export const fetchPcaData = async () => {
    const res = await axios.get(`${API_BASE_URL}/vis_pca_total`);
    return res.data; // JSON 배열
  };

// 평균 유사도 vs 평점 데이터 요청
export const fetchAvgScatterData = async () => {
    const res = await axios.get(`${API_BASE_URL}/vis_avg_sca`);
    return res.data; // [{ cosine_sim: 0.95, rating: 3.9 }, ...]
  };