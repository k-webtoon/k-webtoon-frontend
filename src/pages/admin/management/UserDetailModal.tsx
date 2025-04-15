import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/shadcn/dialog";
import { Button } from "@/shared/ui/shadcn/button";
import { useUserStore } from "@/entities/admin/api/store";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export const UserDetailModal = () => {
  const {
    modalOpen,
    modalUserDetail,
    modalLoading,
    statusActionLoading,
    error,
    closeUserModal,
    activateUser,
    suspendUser,
    deactivateUser,
  } = useUserStore();

  return (
    <Dialog open={modalOpen} onOpenChange={closeUserModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>사용자 상세 정보</DialogTitle>
          <DialogDescription>
            계정 상태 관리 및 상세 정보 확인
          </DialogDescription>
        </DialogHeader>

        {modalLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : modalUserDetail ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* 상세 정보 표시 부분 */}
              <div>
                <p className="text-sm text-muted-foreground">이메일</p>
                <p className="font-medium">{modalUserDetail.userEmail}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">닉네임</p>
                <p className="font-medium">{modalUserDetail.nickname || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">가입일</p>
                <p className="font-medium">
                  {format(
                    new Date(modalUserDetail.createDateTime),
                    "yyyy-MM-dd HH:mm"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">상태</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    modalUserDetail.accountStatus === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : modalUserDetail.accountStatus === "SUSPENDED"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {modalUserDetail.accountStatus === "ACTIVE"
                    ? "활성"
                    : modalUserDetail.accountStatus === "SUSPENDED"
                    ? "정지됨"
                    : "비활성화"}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            사용자 정보를 불러올 수 없습니다
          </div>
        )}

        <DialogFooter className="flex sm:justify-between gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                modalUserDetail && activateUser(modalUserDetail.userEmail)
              }
              disabled={
                statusActionLoading ||
                modalUserDetail?.accountStatus === "ACTIVE"
              }
            >
              {statusActionLoading ? "처리 중..." : "활성화"}
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                modalUserDetail && suspendUser(modalUserDetail.userEmail)
              }
              disabled={
                statusActionLoading ||
                modalUserDetail?.accountStatus === "SUSPENDED"
              }
            >
              {statusActionLoading ? "처리 중..." : "계정 정지"}
            </Button>
            <Button
              variant="outline"
              className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
              onClick={() =>
                modalUserDetail && deactivateUser(modalUserDetail.userEmail)
              }
              disabled={
                statusActionLoading ||
                modalUserDetail?.accountStatus === "DEACTIVATED"
              }
            >
              {statusActionLoading ? "처리 중..." : "비활성화"}
            </Button>
          </div>
          <Button variant="outline" onClick={closeUserModal}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
