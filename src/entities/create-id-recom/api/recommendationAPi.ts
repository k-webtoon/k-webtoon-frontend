import axios from 'axios';

export const fetchRecommendedWebtoons = async (tagList: string[][]) => {
  try {
    const response = await axios.post('http://localhost:5000/api/send_init', {
      tag_list: tagList,
    });
    return response.data;
  } catch (error) {
    console.error('추천 웹툰 요청 실패:', error);
    throw error;
  }
};