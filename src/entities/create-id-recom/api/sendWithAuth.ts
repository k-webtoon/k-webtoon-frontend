import axios from "axios";

export const sendWebtoonLogToSpring = async (
  webtoonIds: number[],
  token: string
) => {
  const response = await axios.post(
    "http://localhost:8080/api/recommend/init",
    { webtoonIds: webtoonIds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
