import axios from 'axios';

export const sendWebtoonLogToSpring = async (webtoonIds: number[], token: string) => {
  const response = await axios.post(
    'http://localhost:8080/api/logs/recommend',
    { webtoon_ids: webtoonIds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};