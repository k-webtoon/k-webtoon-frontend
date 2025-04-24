import axios from 'axios';

export const fetchRecommendedWebtoons = async ({
  tagList,
  popClass,
  thumbClass,
}: {
  tagList: string[][];
  popClass: number[];
  thumbClass: number[];
}) => {
  try {
    const response = await axios.post('http://localhost:5000/api/send_init', {
      tag_list: tagList,
      pop_C_list: popClass,
      thumb_C_list: thumbClass,
    });
    return response.data;
  } catch (error) {
    console.error('추천 웹툰 요청 실패:', error);
    throw error;
  }
};