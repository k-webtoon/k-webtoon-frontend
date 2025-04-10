import { FC, useState, useMemo } from 'react';
import { ManagementLayout } from '@/components/admin/ManagementLayout';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  UserStatus,
  UserStatusEnum,
  userStatusColors,
  userStatusLabels,
  User
} from '@/entities/admin/model/types';

const UserManagement: FC = () => {
  const [filter, setFilter] = useState({
    status: '',
    search: '',
  });

  // 더미 데이터
  const data: User[] = [
    {
      id: 1,
      email: 'user1@example.com',
      nickname: '사용자1',
      status: 'active',
      lastLoginDate: new Date(),
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      email: 'user2@example.com',
      nickname: '사용자2',
      status: 'dormant',
      lastLoginDate: new Date('2024-01-20T15:45:00'),
      createdAt: new Date('2023-12-01'),
    },
    {
      id: 3,
      email: 'user3@example.com',
      nickname: '사용자3',
      status: 'suspended',
      lastLoginDate: new Date('2024-03-15T09:20:00'),
      createdAt: new Date('2024-02-01'),
    },
  ];

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return data.filter(user => {
      if (filter.status && user.status !== filter.status) return false;
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return user.email.toLowerCase().includes(searchLower) ||
               user.nickname.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }, [data, filter]);

  // 통계 데이터
  const stats = useMemo(() => {
    const total = data.length;
    const active = data.filter(u => u.status === 'active').length;
    const dormant = data.filter(u => u.status === 'dormant').length;
    const suspended = data.filter(u => u.status === 'suspended').length;
    
    return { total, active, dormant, suspended };
  }, [data]);

  const dashboardCards = [
    { 
      title: '총 사용자', 
      value: stats.total,
      onClick: () => setFilter(prev => ({ ...prev, status: '' }))
    },
    { 
      title: '활성 사용자', 
      value: stats.active,
      onClick: () => setFilter(prev => ({ ...prev, status: UserStatusEnum.ACTIVE }))
    },
    { 
      title: '휴면 사용자', 
      value: stats.dormant,
      onClick: () => setFilter(prev => ({ ...prev, status: UserStatusEnum.DORMANT }))
    },
    { 
      title: '정지된 사용자', 
      value: stats.suspended,
      onClick: () => setFilter(prev => ({ ...prev, status: UserStatusEnum.SUSPENDED }))
    },
  ];

  const statusOptions = Object.values(UserStatusEnum).map(status => ({
    value: status,
    label: userStatusLabels[status],
  }));

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'email',
      header: '이메일',
    },
    {
      accessorKey: 'nickname',
      header: '닉네임',
    },
    {
      accessorKey: 'status',
      header: '상태',
      cell: ({ row }) => {
        const status = row.original.status;
        const { bg, text } = userStatusColors[status];
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
            {userStatusLabels[status]}
          </span>
        );
      },
    },
    {
      accessorKey: 'lastLoginDate',
      header: '마지막 로그인',
      cell: ({ row }) => format(row.original.lastLoginDate, 'yyyy-MM-dd HH:mm'),
    },
    {
      accessorKey: 'createdAt',
      header: '가입일',
      cell: ({ row }) => format(row.original.createdAt, 'yyyy-MM-dd'),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
              상세보기
            </button>
            <button className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600">
              계정정지
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <ManagementLayout
      title="사용자 관리"
      description="사용자 계정을 관리하고 모니터링합니다."
      dashboardCards={dashboardCards}
      statusOptions={statusOptions}
      columns={columns}
      data={filteredData}
      filter={filter}
      onFilterChange={setFilter}
      pagination={{
        page: 1,
        limit: 10,
        total: filteredData.length,
        onPageChange: (page) => console.log('페이지 변경:', page),
      }}
    />
  );
};

export default UserManagement; 