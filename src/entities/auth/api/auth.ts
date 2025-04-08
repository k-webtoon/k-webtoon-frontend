import axios from 'axios';
import { 
  VerifyPhoneNumberRequest,
  VerifyEmailRequest,
  SecurityQuestionRequest, 
  ChangePasswordRequest,
  AuthResponse,
  SecurityQuestionResponse,
  FindEmailResponse
} from './types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const authApi = {
  // 전화번호 인증 및 보안 질문 조회
  verifyPhoneNumber: async (request: VerifyPhoneNumberRequest): Promise<SecurityQuestionResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/verifyPhoneNumber`, request);
    return { securityQuestion: response.data };
  },

  // 이메일 검증 및 보안 질문 조회
  verifyEmail: async (request: VerifyEmailRequest): Promise<SecurityQuestionResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/verifyEmail`, request);
    return { securityQuestion: response.data };
  },

  // 이메일 찾기
  findEmail: async (request: SecurityQuestionRequest): Promise<FindEmailResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/findEmail`, request);
    return { email: response.data };
  },

  // 비밀번호 찾기 - 보안 질문 검증
  verifySecurityAnswer: async (request: SecurityQuestionRequest): Promise<boolean> => {
    const response = await axios.post(`${API_BASE_URL}/auth/verifySecurityAnswer`, request);
    return response.data;
  },

  // 비밀번호 변경
  changePassword: async (request: ChangePasswordRequest): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/changePassword`, request);
    return response.data;
  }
};