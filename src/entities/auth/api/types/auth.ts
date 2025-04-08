export interface VerifyPhoneNumberRequest {
  phoneNumber: string;
}

export interface VerifyEmailRequest {
  email: string;
}

export interface SecurityQuestionRequest {
  phoneNumber?: string;
  email?: string;
  securityQuestion: string;
  securityAnswer: string;
}

export interface ChangePasswordRequest {
  userEmail: string;
  phoneNumber: string;
  securityQuestion: string;
  securityAnswer: string;
  newPassword: string;
}

export interface AuthResponse {
  message: string;
  data?: any;
}

export interface SecurityQuestionResponse {
  securityQuestion: string;
}

export interface FindEmailResponse {
  email: string;
} 