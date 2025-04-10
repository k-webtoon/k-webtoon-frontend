import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { SignupData } from "@/entities/auth/model/types";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";

interface AgeVerificationProps {
  formData: SignupData;
  updateFormData: (data: Partial<SignupData>) => void;
  nextStep: () => void;
}

const AgeVerification: React.FC<AgeVerificationProps> = ({
  formData,
  updateFormData,
  nextStep,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const currentYear = new Date().getFullYear();
  const [isUnderAge, setIsUnderAge] = useState(false);

  // 연도 선택 옵션 생성 (현재 년도부터 100년 전까지)
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const checkAge = (year: string) => {
    const age = currentYear - Number(year);
    const isUnder = age < 14;
    setIsUnderAge(isUnder);
    setError(isUnder ? "만 14세 이상만 가입할 수 있습니다." : "");
  };

  const handleYearChange = (year: string) => {
    updateFormData({ birthYear: year });
    checkAge(year);
  };

  useEffect(() => {
    if (formData.birthYear) {
      checkAge(formData.birthYear);
    }
  }, [formData.birthYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUnderAge) {
      setTimeout(() => {
        navigate("/");
      }, 2000);
      return;
    }
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
          연령 확인
        </h3>
        <p className="text-sm text-gray-500 text-center mb-8">
          법적 연령 제한으로 인해 가입이 제한될 수 있습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label
            htmlFor="birthYear"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            출생연도
          </label>
          <div className="relative">
            <select
              id="birthYear"
              value={formData.birthYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              required
            >
              <option value="">출생연도 선택</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {error && (
            <div className="mt-2 p-3 bg-red-50 rounded-md">
              <p className="text-sm text-red-600 flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}
          {formData.birthYear && !isUnderAge && (
            <div className="mt-2 p-3 bg-green-50 rounded-md">
              <p className="text-sm text-green-600 flex items-center">
                <span className="mr-2">✓</span>
                가입 가능한 연령입니다.
              </p>
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={!formData.birthYear || isUnderAge}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
              ${
                !formData.birthYear || isUnderAge
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
          >
            {isUnderAge ? "가입 불가" : "다음"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgeVerification;
