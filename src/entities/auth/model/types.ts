// ===============
// 도메인 엔티티 타입
// ===============
export interface UserInfo {
  email: string;
  role: string;
  userId: number;
}

// ===============
// 상수 및 유틸리티
// ===============

// JWT 페이로드 타입
export interface JwtPayload {
  sub: string;
  role: string;
  id: number;
  iat: number;
  exp: number;
}

// ===============
// API 요청/응답 타입
// ===============

// 로그인 API 요청 타입
export interface LoginRequest {
  userEmail: string;
  userPassword: string;
}

// 회원가입 API 요청 타입
export interface SignupRequest {
  userEmail: string;
  userPassword: string;
  userAge: number;
  gender: string;
  nickname: string;
  phoneNumber: string;
  securityQuestion: string;
  securityAnswer: string;
}

// 회원가입 API 응답 타입
export interface  SignupResponse {
  indexId: number;
  userEmail: string;
  nickname: string;
}

// 전화번호 인증 및 보안 질문 조회 API 요청 타입
export interface VerifyPhoneNumberRequest {
  phoneNumber: string;
}

// 이메일 검증 및 보안 질문 조회 API 요청 타입
export interface VerifyEmailRequest {
  email: string;
}

// 전화번호 인증 및 보안 질문 조회 API, 이메일 검증 및 보안 질문 조회 API 응답 타입
export interface SecurityQuestionResponse {
  securityQuestion: string;
}


// 비밀번호, 이메일 찾기 API 요청 타입
export interface SecurityQuestionRequest {
  phoneNumber?: string;
  email?: string;
  securityQuestion: string;
  securityAnswer: string;
}

// 이메일 찾기 API 응답 타입
export interface FindEmailResponse {
  email: string;
}

// 비밀번호 변경 API 요청 타입
export interface ChangePasswordRequest {
  userEmail: string;
  phoneNumber: string;
  securityQuestion: string;
  securityAnswer: string;
  newPassword: string;
}

// 비밀번호 변경 API 응답 타입
export interface AuthResponse {
  message: string;
  data?: any;
}


// ===============
// 상태 관리 타입
// ===============
export interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  initialize: () => void;
  login: (userEmail: string, userPassword: string) => Promise<void>;
  logout: () => void;
  getUserInfo: () => UserInfo | null;
}










export interface SignupData {
  birthYear: string;
  terms: {
    required: boolean;
    privacy: boolean;
    marketing: boolean;
  };
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  securityQuestion: string;
  securityAnswer: string;
  phoneNumber: string;
  gender: string;
}

export interface UserRegisterDTO {
  userEmail: string;
  userPassword: string;
  userAge: number;
  gender: string;
  nickname: string;
  phoneNumber: string;
  securityQuestion: string;
  securityAnswer: string;
}

export interface termsContentType {
  required: string;
  privacy: string;
  marketing: string;
}

