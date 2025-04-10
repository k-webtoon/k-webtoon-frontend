import React, { useState } from "react";
import { usePasswordStore } from "@/entities/auth/model/newPasswordStore";

const ChangePassword = () => {
  const { changePassword, loading } = usePasswordStore();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 비밀번호 조건 검사
  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|;:'",.<>?/~`\\/-]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // 새 비밀번호 조건 검사
    if (!validatePassword(passwordData.newPassword)) {
      setMessage({
        type: "error",
        text: "비밀번호는 8자리 이상이며, 문자, 숫자, 특수문자를 포함해야 합니다.",
      });
      return;
    }

    // 새 비밀번호와 새 비밀번호 확인 일치 여부 검사
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setMessage({
        type: "error",
        text: "새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.",
      });
      return;
    }

    try {
      await changePassword(passwordData);
      alert("비밀번호가 성공적으로 변경되었습니다");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error: any) {
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">비밀번호 변경</h2>
      <form onSubmit={handlePasswordChange} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            현재 비밀번호
          </label>
          <input
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            새 비밀번호
          </label>
          <input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            새 비밀번호 확인
          </label>
          <input
            type="password"
            value={passwordData.confirmNewPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                confirmNewPassword: e.target.value,
              }))
            }
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded-md transition-colors`}
        >
          {loading ? "변경 중..." : "비밀번호 변경"}
        </button>
      </form>
      {message && (
        <div
          className={`mt-4 p-4 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
