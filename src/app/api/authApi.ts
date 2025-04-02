// import axios from "axios";
// import { LoginDTO } from "@/entities/auth/model/types.ts";
//
// // API 기본 URL 설정
// const BASE_URL = "http://localhost:8080/api/auth";
//
// /**
//  * 인증 관련 API 요청을 처리하는 객체
//  */
// export const authApi = {
//   /**
//    * 로그인 요청을 보내고 JWT 토큰을 반환받습니다.
//    * @param {LoginDTO} loginData - 이메일과 비밀번호 정보
//    * @returns {Promise<string>} - JWT 토큰
//    */
//   login: async (loginData: LoginDTO): Promise<string> => {
//     try {
//       const response = await axios.post(`${BASE_URL}/login`, loginData, {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         withCredentials: true,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("로그인 오류:", error);
//       throw error;
//     }
//   },
//
//   /**
//    * 현재 토큰의 유효성을 검증합니다.
//    * @param {string} token - 검증할 JWT 토큰
//    * @returns {Promise<boolean>} - 토큰 유효 여부
//    */
//   validateToken: async (token: string): Promise<boolean> => {
//     try {
//       // 토큰 구조 확인 (JWT는 3개 부분으로 나뉘어져 있음)
//       const tokenParts = token.split(".");
//       if (tokenParts.length !== 3) {
//         return false;
//       }
//
//       // 토큰의 페이로드(payload) 디코딩
//       const payload = JSON.parse(atob(tokenParts[1]));
//
//       // 만료 시간 확인
//       if (payload.exp) {
//         const expTime = payload.exp * 1000; // JWT는 초 단위, JS는 밀리초 단위
//         const currentTime = Date.now();
//
//         // 만료되지 않았으면 유효한 것으로 간주
//         return expTime > currentTime;
//       }
//
//       return true;
//     } catch (error) {
//       console.error("토큰 검증 오류:", error);
//       return false;
//     }
//   },
// };
