import React, { useState } from "react";
import { Checkbox } from "@/shared/ui/shadcn/checkbox";
import type { SignupData } from "@/entities/auth/model/types.ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/shadcn/dialog";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";
import { termsContentType } from "@/entities/auth/model/types.ts";

interface TermsAgreementProps {
  formData: SignupData;
  updateFormData: (data: Partial<SignupData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

// 약관 내용 (실제로는 API에서 가져오거나 별도 파일로 관리)
const termsContent: termsContentType = {
  required: `
제1조 (목적)
이 약관은 K-Webtoon(이하 "회사")이 제공하는 웹툰 서비스(이하 "서비스")의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.

제2조 (용어의 정의)
1. "서비스"란 회사가 제공하는 웹툰 및 관련 서비스를 의미합니다.
2. "회원"이란 이 약관에 동의하고 회사와 이용계약을 체결한 자를 의미합니다.

제3조 (약관의 효력 및 변경)
1. 이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
2. 회사는 약관의 변경이 필요한 경우 사전 고지 후 변경할 수 있습니다.
  `,
  privacy: `
개인정보 수집 및 이용 동의

1. 수집하는 개인정보 항목
- 필수항목: 이메일 주소, 비밀번호, 닉네임
- 선택항목: 관심 장르, 프로필 이미지

2. 수집 및 이용목적
- 서비스 제공 및 계정 관리
- 맞춤형 콘텐츠 추천
- 서비스 개선 및 신규 서비스 개발

3. 보유 및 이용기간
회원 탈퇴 시까지 (단, 관련 법령에 따라 일정 기간 보관이 필요한 정보는 해당 기간 동안 보관)
  `,
  marketing: `
마케팅 정보 수신 동의

1. 수신 정보 종류
- 신규 웹툰 알림
- 이벤트 및 프로모션 정보
- 서비스 업데이트 소식

2. 수신 방법
- 이메일
- 푸시 알림

3. 수신 철회
- 언제든지 설정에서 수신 거부 가능
- 수신 거부 시에도 서비스 이용 가능
  `,
};

const TermsAgreement: React.FC<TermsAgreementProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const [openTerms, setOpenTerms] = useState<keyof SignupData["terms"] | null>(
    null
  );
  const [hasViewedRequired, setHasViewedRequired] = useState(false);
  const [hasViewedPrivacy, setHasViewedPrivacy] = useState(false);

  const handleAllAgree = (checked: boolean) => {
    updateFormData({
      terms: {
        required: checked,
        privacy: checked,
        marketing: checked,
      },
    });
  };

  const handleIndividualAgree = (
    key: keyof SignupData["terms"],
    checked: boolean
  ) => {
    updateFormData({
      terms: {
        ...formData.terms,
        [key]: checked,
      },
    });
  };

  const handleOpenTerms = (key: keyof SignupData["terms"]) => {
    setOpenTerms(key);
    if (key === "required") setHasViewedRequired(true);
    if (key === "privacy") setHasViewedPrivacy(true);
  };

  const isAllAgreed = formData.terms.required && formData.terms.privacy;
  const canProceed = isAllAgreed && hasViewedRequired && hasViewedPrivacy;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
          이용약관 동의
        </h3>
        <p className="text-sm text-gray-500 text-center mb-8">
          서비스 이용을 위해 약관에 동의해 주세요.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
          <Checkbox
            id="all"
            checked={Object.values(formData.terms).every(Boolean)}
            onCheckedChange={(checked) => handleAllAgree(checked as boolean)}
          />
          <label
            htmlFor="all"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            전체 동의
          </label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={formData.terms.required}
                onCheckedChange={(checked) =>
                  handleIndividualAgree("required", checked as boolean)
                }
              />
              <label
                htmlFor="required"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                [필수] 서비스 이용약관 동의
              </label>
            </div>
            <button
              onClick={() => handleOpenTerms("required")}
              className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-500"
            >
              {hasViewedRequired ? "다시 보기" : "보기 *"}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="privacy"
                checked={formData.terms.privacy}
                onCheckedChange={(checked) =>
                  handleIndividualAgree("privacy", checked as boolean)
                }
              />
              <label
                htmlFor="privacy"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                [필수] 개인정보 수집 및 이용 동의
              </label>
            </div>
            <button
              onClick={() => handleOpenTerms("privacy")}
              className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-500"
            >
              {hasViewedPrivacy ? "다시 보기" : "보기 *"}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketing"
                checked={formData.terms.marketing}
                onCheckedChange={(checked) =>
                  handleIndividualAgree("marketing", checked as boolean)
                }
              />
              <label
                htmlFor="marketing"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                [선택] 마케팅 정보 수신 동의
              </label>
            </div>
            <button
              onClick={() => handleOpenTerms("marketing")}
              className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-500"
            >
              보기
            </button>
          </div>
        </div>
      </div>

      {!canProceed && isAllAgreed && (
        <p className="text-sm text-red-500 mt-4 text-center">
          필수 약관을 확인해주세요. (약관 보기 필요)
        </p>
      )}

      <Dialog open={!!openTerms} onOpenChange={() => setOpenTerms(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {openTerms === "required" && "서비스 이용약관"}
              {openTerms === "privacy" && "개인정보 수집 및 이용"}
              {openTerms === "marketing" && "마케팅 정보 수신"}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="p-4 whitespace-pre-line">
              {openTerms && termsContent[openTerms]}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between space-x-4 mt-8">
        <button
          onClick={prevStep}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          이전
        </button>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            ${
              canProceed
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-indigo-300 cursor-not-allowed"
            }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default TermsAgreement;
