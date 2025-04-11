import React, { useState, useEffect } from "react";
import type { SignupData } from "@/entities/auth/model/types.ts";
import { Eye, EyeOff } from "lucide-react";
import { useSignupStore } from "@/entities/auth/api/signupStore.ts";

interface UserInfoProps {
  formData: SignupData;
  updateFormData: (data: Partial<SignupData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

interface ValidationState {
  email: {
    isValid: boolean;
    message: string;
  };
  password: {
    isValid: boolean;
    message: string;
    strength: "weak" | "medium" | "strong";
  };
  confirmPassword: {
    isValid: boolean;
    message: string;
  };
  nickname: {
    isValid: boolean;
    message: string;
  };
  phoneNumber: {
    isValid: boolean;
    message: string;
  };
  gender: {
    isValid: boolean;
    message: string;
  };
}

// const genres = [
//   "액션",
//   "로맨스",
//   "판타지",
//   "스포츠",
//   "일상",
//   "드라마",
//   "코미디",
//   "스릴러",
//   "미스터리",
//   "SF",
// ];

const UserInfo: React.FC<UserInfoProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    email: { isValid: false, message: "" },
    password: { isValid: false, message: "", strength: "weak" },
    confirmPassword: { isValid: false, message: "" },
    nickname: { isValid: false, message: "" },
    phoneNumber: { isValid: false, message: "" },
    gender: { isValid: false, message: "" },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(email),
      message: emailRegex.test(email) ? "" : "올바른 이메일 형식이 아닙니다.",
    };
  };

  const validatePassword = (password: string) => {
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    let strength: "weak" | "medium" | "strong" = "weak";
    let message = "";

    if (!password) {
      message = "비밀번호를 입력해주세요.";
    } else if (!isLongEnough) {
      message = "비밀번호는 8자 이상이어야 합니다.";
    } else {
      const score = [hasNumber, hasLetter, hasSpecial].filter(Boolean).length;
      strength = score === 3 ? "strong" : score === 2 ? "medium" : "weak";
      message =
        strength === "weak" ? "숫자, 문자, 특수문자를 조합해주세요." : "";
    }

    return {
      isValid: isLongEnough && strength !== "weak",
      message,
      strength,
    };
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    return {
      isValid: password === confirmPassword && !!confirmPassword,
      message:
        password === confirmPassword ? "" : "비밀번호가 일치하지 않습니다.",
    };
  };

  const validateNickname = (nickname: string) => {
    return {
      isValid: nickname.length >= 2,
      message: nickname.length >= 2 ? "" : "닉네임은 2자 이상이어야 합니다.",
    };
  };

  const validatePhoneNumber = (phoneNumber: string) => ({
    isValid: /^01[0-9]-[0-9]{3,4}-[0-9]{4}$/.test(phoneNumber),
    message: /^01[0-9]-[0-9]{3,4}-[0-9]{4}$/.test(phoneNumber)
      ? ""
      : "전화번호 형식이 올바르지 않습니다.",
  });

  const validateGender = (gender: string) => ({
    isValid: Boolean(gender),
    message: Boolean(gender) ? "" : "성별을 선택해주세요.",
  });

  useEffect(() => {
    setValidation({
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
      nickname: validateNickname(formData.nickname),
      phoneNumber: validatePhoneNumber(formData.phoneNumber),
      gender: validateGender(formData.gender),
    });
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!Object.values(validation).every((v) => v.isValid)) return;

    try {
      const birthYear = parseInt(formData.birthYear);
      const userAge = new Date().getFullYear() - birthYear;

      await useSignupStore.getState().register({
        userEmail: formData.email,
        userPassword: formData.password,
        userAge,
        gender: formData.gender || "비공개",
        nickname: formData.nickname,
        phoneNumber: formData.phoneNumber || "미작성",
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer,
      });

      nextStep();
    } catch (error) {
      console.error("회원가입 에러:", error);
      setErrorMessage("회원가입 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const getPasswordStrengthColor = (strength: "weak" | "medium" | "strong") => {
    switch (strength) {
      case "strong":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-red-500";
    }
  };

  // const handleInterestChange = (genre: string) => {
  //   const newInterests = formData.interests.includes(genre)
  //     ? formData.interests.filter((g) => g !== genre)
  //     : formData.interests.length < 3
  //     ? [...formData.interests, genre]
  //     : formData.interests;

  //   updateFormData({ interests: newInterests });
  // };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
          회원 정보 입력
        </h3>
        <p className="text-sm text-gray-500 text-center mb-8">
          웹툰 서비스 이용을 위한 기본 정보를 입력해주세요.
        </p>
      </div>

      {/* 에러 메시지 표시 */}
      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">오류:</strong>
          <span className="block sm:inline"> {errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            이메일
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm
                ${
                  validation.email.isValid
                    ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
              required
            />
            {validation.email.message && (
              <p className="mt-1 text-sm text-red-600">
                {validation.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            비밀번호
          </label>
          <div className="mt-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={(e) => updateFormData({ password: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {formData.password && (
            <div className="mt-2">
              <div className="flex space-x-1">
                {["weak", "medium", "strong"].map((level) => (
                  <div
                    key={level}
                    className={`h-1 w-full rounded-full ${
                      validation.password.strength === "weak"
                        ? "bg-red-500"
                        : validation.password.strength === "medium" &&
                          level !== "strong"
                        ? "bg-yellow-500"
                        : validation.password.strength === "strong"
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`mt-1 text-sm ${
                  validation.password.strength === "strong"
                    ? "text-green-600"
                    : validation.password.strength === "medium"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {validation.password.message ||
                  (validation.password.strength === "strong"
                    ? "안전한 비밀번호입니다."
                    : validation.password.strength === "medium"
                    ? "적정한 비밀번호입니다."
                    : "비밀번호를 더 강화해주세요.")}
              </p>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            비밀번호 확인
          </label>
          <div className="mt-1">
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) =>
                updateFormData({ confirmPassword: e.target.value })
              }
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm
                ${
                  validation.confirmPassword.isValid && formData.confirmPassword
                    ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
              required
            />
            {validation.confirmPassword.message && (
              <p className="mt-1 text-sm text-red-600">
                {validation.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-medium text-gray-700"
          >
            닉네임
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="nickname"
              value={formData.nickname}
              onChange={(e) => updateFormData({ nickname: e.target.value })}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm
                ${
                  validation.nickname.isValid && formData.nickname
                    ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
              required
            />
            {validation.nickname.message && (
              <p className="mt-1 text-sm text-red-600">
                {validation.nickname.message}
              </p>
            )}
          </div>

          {/* 성별 입력 필드 */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              성별
            </label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => updateFormData({ gender: e.target.value })}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                validation.gender.isValid
                  ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
              required
            >
              <option value="">선택</option>
              <option value="남성">남성</option>
              <option value="여성">여성</option>
              <option value="비공개">비공개</option>
            </select>
            {validation.gender.message && (
              <p className="mt-1 text-sm text-red-600">
                {validation.gender.message}
              </p>
            )}
          </div>

          {/* 전화번호 입력 필드 */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              전화번호
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
              placeholder="010-1234-5678"
              pattern="^01[016789]-\d{3,4}-\d{4}$"
              required
              className={`block w-full px3 py2 border rounded-md shadow-sm 
      ${
        validation.phoneNumber.isValid ? "border-green-500" : "border-gray-300"
      }`}
            />
            {validation.phoneNumber.message && (
              <p className="mt-1 text-sm text-red-600">
                {validation.phoneNumber.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="securityQuestion"
              className="block text-sm font-medium text-gray-700"
            >
              보안 질문
            </label>
            <div className="mt-1">
              <select
                id="securityQuestion"
                value={formData.securityQuestion}
                onChange={(e) =>
                  updateFormData({ securityQuestion: e.target.value })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">보안 질문을 선택하세요</option>
                <option value="어머니의 성함은?">어머니의 성함은?</option>
                <option value="첫 애완동물 이름은?">첫 애완동물 이름은?</option>
                <option value="만약 과일이 될 수 있다면, 어떤 과일이 되고 싶나요?">
                  만약 과일이 될 수 있다면, 어떤 과일이 되고 싶나요?
                </option>
                <option value="좋아하는 색깔은?">좋아하는 색깔은?</option>
                <option value="자라난 거주지의 거리 이름은?">
                  자라난 거주지의 거리 이름은?
                </option>
                <option value="당신의 인생이 영화는?">
                  당신의 인생이 영화는?
                </option>
                <option value="태어난 도시는?">태어난 도시는?</option>
                <option value="가장 좋아하는 책의 이름은?">
                  가장 좋아하는 책의 이름은?
                </option>
                <option value="가장 좋아하는 만화 캐릭터는?">
                  가장 좋아하는 만화 캐릭터는?
                </option>
                <option value="가장 좋아하는 피자 토핑은?">
                  가장 좋아하는 피자 토핑은?
                </option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="securityAnswer"
              className="block text-sm font-medium text-gray-700"
            >
              보안 답변
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="securityAnswer"
                value={formData.securityAnswer}
                onChange={(e) =>
                  updateFormData({ securityAnswer: e.target.value })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="보안 질문에 대한 답변"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            이전
          </button>
          <button
            type="submit"
            disabled={!Object.values(validation).every((v) => v.isValid)}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInfo;
