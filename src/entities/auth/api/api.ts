import axios from 'axios';
import {
  VerifyPhoneNumberRequest,
  VerifyEmailRequest,
  SecurityQuestionRequest,
  ChangePasswordRequest,
  AuthResponse,
  SecurityQuestionResponse,
  FindEmailResponse, SignupRequest, SignupResponse
} from '@/entities/auth/model/types.ts';
import { LoginRequest } from "@/entities/auth/model/types.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/auth';

export const authApi = {
  // 로그인 API
  login: async (loginData: LoginRequest): Promise<string> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, loginData);
      return response.data;
    } catch (error) {
      console.error("로그인 오류:", error);
      throw error;
    }
  },

  // 회원가입 API
  registerUser: async (userData: SignupRequest): Promise<SignupResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("회원가입 오류:", error);
      throw error;
    }
  },

  // 전화번호 인증 및 보안 질문 조회
  verifyPhoneNumber: async (request: VerifyPhoneNumberRequest): Promise<SecurityQuestionResponse> => {
    const response = await axios.post(`${API_BASE_URL}/verifyPhoneNumber`, request);
    return { securityQuestion: response.data };
  },

  // 이메일 검증 및 보안 질문 조회
  verifyEmail: async (request: VerifyEmailRequest): Promise<SecurityQuestionResponse> => {
    const response = await axios.post(`${API_BASE_URL}/verifyEmail`, request);
    return { securityQuestion: response.data };
  },

  // 이메일 찾기
  findEmail: async (request: SecurityQuestionRequest): Promise<FindEmailResponse> => {
    const response = await axios.post(`${API_BASE_URL}/findEmail`, request);
    return { email: response.data };
  },

  // 비밀번호 찾기 - 보안 질문 검증
  verifySecurityAnswer: async (request: SecurityQuestionRequest): Promise<boolean> => {
    const response = await axios.post(`${API_BASE_URL}/verifySecurityAnswer`, request);
    return response.data;
  },

  // 비밀번호 변경
  changePassword: async (request: ChangePasswordRequest): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/changePassword`, request);
    return response.data;
  }
};