import { FC, useEffect, useMemo, useState } from "react";
import { ManagementLayout } from "@/components/admin/ManagementLayout";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useUserStore } from "@/entities/admin/api/store";
import {
  UserListDTO,
  AccountStatusMap,
  userStatusConfig,
} from "@/entities/admin/model/types";
import { UserDetailModal } from "@/pages/admin/management/UserDetailModal";

const UserManagement: FC = () => {
  const {
    users,
    currentPage,
    pageSize,
    totalUsers,
    loading,
    fetchUsers,
    fetchUserSummary,
    userSummary,
    setPage,
    // 추가된 상태 및 액션
    usersByStatus,
    usersByStatusTotal,
    usersByStatusPage,
    fetchUsersByStatus,
  } = useUserStore();

  const [filter, setFilter] = useState({
    status: "",
    search: "",
  });

  // 상태 변경 핸들러 (수정됨)
  const handleStatusChange = (value: string) => {
    const newStatus = value === "all" ? "" : value;
    setFilter((prev) => ({ ...prev, status: newStatus }));

    if (newStatus === "") {
      fetchUsers(0, pageSize);
    } else {
      fetchUsersByStatus(newStatus.toUpperCase(), 0, pageSize);
    }
  };

  // 데이터 소스 분기 처리 (수정됨)
  const dataSource = filter.status ? usersByStatus : users;
  const totalItems = filter.status ? usersByStatusTotal : totalUsers;
  const currentPageNumber = filter.status ? usersByStatusPage : currentPage;

  // 페이지 로드 시 초기 데이터 불러오기
  useEffect(() => {
    fetchUsers(currentPage, pageSize);
    fetchUserSummary();
  }, [currentPage, pageSize]);

  const dashboardCards = [
    {
      title: "총 사용자",
      value: userSummary?.total || 0,
      onClick: () => handleStatusChange("all"),
    },
    {
      title: "활성 사용자",
      value: userSummary?.active || 0,
      onClick: () => handleStatusChange("ACTIVE"),
    },
    {
      title: "정지된 사용자",
      value: userSummary?.suspended || 0,
      onClick: () => handleStatusChange("SUSPENDED"),
    },
    {
      title: "비활성 사용자",
      value: userSummary?.deactivated || 0,
      onClick: () => handleStatusChange("DEACTIVATED"),
    },
  ];

  const statusOptions = [
    { value: "all", label: "전체" },
    { value: "ACTIVE", label: userStatusConfig.labels.active },
    { value: "SUSPENDED", label: userStatusConfig.labels.suspended },
    { value: "DEACTIVATED", label: userStatusConfig.labels.deactivated },
  ];

  const columns: ColumnDef<UserListDTO>[] = [
    { accessorKey: "userEmail", header: "이메일" },
    {
      accessorKey: "accountStatus",
      header: "상태",
      cell: ({ row }) => {
        const status = AccountStatusMap[row.original.accountStatus];
        const { bg, text } = userStatusConfig.colors[status];
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${bg} ${text}`}>
            {userStatusConfig.labels[status]}
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
            onClick={() =>
              useUserStore.getState().openUserModal(row.original.indexId)
            }
          >
            상세보기
          </button>
          <button
            className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
            onClick={() => {
              const confirmed = window.confirm(
                `${row.original.userEmail} 계정을 정지하시겠습니까?`
              );
              if (confirmed) {
                useUserStore.getState().suspendUser(row.original.userEmail);
              }
            }}
          >
            계정정지
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ManagementLayout
        title="사용자 관리"
        description="사용자 계정을 관리하고 모니터링합니다."
        dashboardCards={dashboardCards}
        statusOptions={statusOptions}
        columns={columns}
        data={dataSource}
        filter={filter}
        onFilterChange={(newFilter) => setFilter(newFilter)}
        pagination={{
          page: currentPageNumber + 1,
          limit: pageSize,
          total: totalItems,
          onPageChange: (page) => {
            const adjustedPage = page - 1;
            if (filter.status) {
              fetchUsersByStatus(filter.status, adjustedPage, pageSize);
            } else {
              setPage(adjustedPage);
            }
          },
        }}
      />
      <UserDetailModal /> {/* 모달 컴포넌트 추가 */}
    </>
  );
};

export default UserManagement;
