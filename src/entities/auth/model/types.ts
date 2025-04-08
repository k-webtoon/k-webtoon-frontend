export interface LoginDTO {
  userEmail: string;
  userPassword: string;
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
