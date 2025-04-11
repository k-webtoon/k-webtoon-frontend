import React, { FC, useState, useEffect, useMemo } from "react";
import { ManagementLayout } from "@/components/admin/ManagementLayout";
import UserDetailModal from "@/pages/admin/management/UserDetailModal";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  useAdminUserStore,
  useUserManagementStore,
  useAdminUserDetailStore,
} from "@/entities/admin/api/store";
import {
  AdminUser,
  AdminUserDetail,
  UserStatusEnum,
  userStatusLabels,
  userStatusColors,
  UserStatus,
} from "@/entities/admin/model/types";

const UserManagement: FC = () => {
  const {
    users,
    page,
    size,
    totalPages,
    isLoading,
    error,
    fetchUsers,
    setPagination,
  } = useAdminUserStore();

  const { stopUser } = useUserManagementStore();
  const { userDetail, fetchUserDetail, resetUserDetail } =
    useAdminUserDetailStore();

  const [localPage, setLocalPage] = useState(page);
  const [filter, setFilter] = useState({
    status: "",
    search: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 상태 필터 옵션
  const statusOptions = useMemo(
    () =>
      Object.values(UserStatusEnum).map((status) => ({
        value: status,
        label: userStatusLabels[status],
      })),
    []
  );

  // 대시보드 카드
  const dashboardCards = useMemo(
    () => [
      {
        title: "총 사용자",
        value: totalPages * size,
        onClick: () => setFilter((prev) => ({ ...prev, status: "" })),
      },
      {
        title: "활성 사용자",
        value: users.filter(
          (user) => user.accountStatus === UserStatusEnum.ACTIVE
        ).length,
        onClick: () =>
          setFilter((prev) => ({ ...prev, status: UserStatusEnum.ACTIVE })),
      },
      {
        title: "정지된 사용자",
        value: users.filter(
          (user) => user.accountStatus === UserStatusEnum.SUSPENDED
        ).length,
        onClick: () =>
          setFilter((prev) => ({ ...prev, status: UserStatusEnum.SUSPENDED })),
      },
      {
        title: "비활성화된 사용자",
        value: users.filter(
          (user) => user.accountStatus === UserStatusEnum.DEACTIVATED
        ).length,
        onClick: () =>
          setFilter((prev) => ({
            ...prev,
            status: UserStatusEnum.DEACTIVATED,
          })),
      },
    ],
    [users, totalPages, size]
  );

  const columns: ColumnDef<AdminUser>[] = useMemo(
    () => [
      {
        accessorKey: "userEmail",
        header: "이메일",
      },
      {
        accessorKey: "accountStatus",
        header: "상태",
        cell: ({ row }) => {
          const status = row.original.accountStatus;
          const { bg, text } = userStatusColors[status];
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
            >
              {userStatusLabels[status]}
            </span>
          );
        },
      },
      {
        accessorKey: "createDateTime",
        header: "가입일",
        cell: ({ row }) =>
          format(new Date(row.original.createDateTime), "yyyy-MM-dd"),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
              onClick={() => handleViewDetail(row.original.indexId)}
            >
              상세보기
            </button>
            <button
              className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
              onClick={() => handleSuspendUser(row.original.userEmail)}
            >
              계정정지
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setLocalPage(newPage);
    setPagination(newPage, size);
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchUsers(localPage, size);
  }, [localPage, size]);

  // 계정 정지 핸들러
  const handleSuspendUser = (email: string) => {
    stopUser({ email })
      .then(() => fetchUsers(localPage, size))
      .catch(console.error);
  };

  // 상세 보기 핸들러
  const handleViewDetail = (userId: number) => {
    fetchUserDetail(userId)
      .then(() => setIsModalOpen(true))
      .catch(console.error);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    resetUserDetail();
    setIsModalOpen(false);
  };

  return (
    <>
      <ManagementLayout
        title="사용자 관리"
        description="사용자 계정을 관리하고 모니터링합니다."
        dashboardCards={dashboardCards}
        statusOptions={statusOptions}
        columns={columns}
        data={users}
        filter={filter}
        onFilterChange={setFilter}
        pagination={{
          page: localPage,
          limit: size,
          total: totalPages * size,
          onPageChange: handlePageChange,
        }}
        isLoading={isLoading}
        error={error}
      />

      <UserDetailModal
        user={userDetail}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default UserManagement;
