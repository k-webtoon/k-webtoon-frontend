import {sendWithAuth} from "./sendWithAuth";

const BASE_URL = "http://localhost:8080/api/logs";

export const logClick = async (page: string, target: string) => {
  await sendWithAuth(`${BASE_URL}/click`, { page, target });
};

export const logPageView = async (page: string, duration: number) => {
  await sendWithAuth(`${BASE_URL}/page-view`, { page, duration });
};

export const logTyping = async (keyword: string, source: string) => {
  await sendWithAuth(`${BASE_URL}/typing`, { keyword, source });
};