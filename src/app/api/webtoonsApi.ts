import axios from "axios";

// 웹툰 검색 API 호출 함수
export const searchWebtoons = async (titleName: string) => {
  const response = await axios.get(
    `http://localhost:8080/webtoons/search?titleName=${titleName}`
  );
  return response.data.content;
};
