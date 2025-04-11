import React from "react";
import { AdminUserDetail } from "@/entities/admin/model/types";

interface UserDetailModalProps {
  user: AdminUserDetail | null; // 상세 정보
  isOpen: boolean; // 모달 열림 상태
  onClose: () => void; // 닫기 핸들러
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold mb-4">사용자 상세 정보</h2>
        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {user.indexId}
          </p>
          <p>
            <strong>Email:</strong> {user.userEmail}
          </p>
          <p>
            <strong>Status:</strong> {user.accountStatus}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(user.createDateTime).toLocaleString()}
          </p>
          <p>
            <strong>Age:</strong> {user.userAge}
          </p>
          <p>
            <strong>Gender:</strong> {user.gender}
          </p>
          <p>
            <strong>Nickname:</strong> {user.nickname}
          </p>
          <p>
            <strong>Phone Number:</strong> {user.phoneNumber}
          </p>
          <p>
            <strong>Security Question:</strong> {user.securityQuestion}
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
