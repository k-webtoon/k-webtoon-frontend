import { FC, useState, useEffect } from 'react';
import { Button } from '@/shared/ui/shadcn/button';
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { Search } from 'lucide-react';
import { Input } from "@/shared/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/shadcn/select";
import {
  fetchUsers,
  updateUserStatus,
  deleteUser,
  createUser,
  updateUser,
  exportUsersToExcel,
} from '@/entities/admin/api/managementApi';
import { ManagementPageProps } from '@/entities/admin/model/managementPage';
import { AccountStatus, UserRole } from '@/entities/user/model/appUser';
import { UserResponse } from '@/entities/admin/api/types';

// 사용자 상태 라벨
const userStatusLabels: Record<AccountStatus, string> = {
  [AccountStatus.ACTIVE]: '정상',
  [AccountStatus.SUSPENDED]: '정지',
  [AccountStatus.DEACTIVATED]: '비활성화'
};

// 사용자 상태 색상
const userStatusColors: Record<AccountStatus, { bg: string; text: string }> = {
  [AccountStatus.ACTIVE]: { bg: 'bg-green-100', text: 'text-green-800' },
  [AccountStatus.SUSPENDED]: { bg: 'bg-red-100', text: 'text-red-800' },
  [AccountStatus.DEACTIVATED]: { bg: 'bg-gray-100', text: 'text-gray-800' }
};

const UserManagement: FC<ManagementPageProps> = ({ title = '사용자 관리', description }) => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AccountStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    deactivated: 0
  });

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetchUsers({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        status: statusFilter || undefined
      });

      setUsers(response.data);
      setTotalPages(response.totalPages);
      setTotalUsers(response.total);
      setUserStats({
        total: response.total,
        active: response.stats.active || 0,
        suspended: response.stats.suspended || 0,
        deactivated: response.stats.deactivated || 0
      });
    } catch (error) {
      console.error('사용자 목록을 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchQuery, statusFilter]);

  const handleStatusChange = async (userId: number, newStatus: AccountStatus) => {
    try {
      await updateUserStatus(userId, { status: newStatus });
      loadUsers();
    } catch (error) {
      console.error('사용자 상태 변경 실패:', error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await exportUsersToExcel({
        search: searchQuery,
        status: statusFilter || undefined
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('엑셀 다운로드에 실패했습니다:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      try {
        await deleteUser(userId);
        loadUsers();
      } catch (error) {
        console.error('사용자 삭제에 실패했습니다:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setStatusFilter(null)}>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-600">전체 사용자</h3>
            <p className="text-2xl font-bold mt-1">{userStats.total}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setStatusFilter(AccountStatus.ACTIVE)}>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-600">활성 사용자</h3>
            <p className="text-2xl font-bold mt-1 text-green-600">{userStats.active}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setStatusFilter(AccountStatus.SUSPENDED)}>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-600">정지된 사용자</h3>
            <p className="text-2xl font-bold mt-1 text-red-600">{userStats.suspended}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setStatusFilter(AccountStatus.DEACTIVATED)}>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-600">비활성화된 사용자</h3>
            <p className="text-2xl font-bold mt-1 text-gray-600">{userStats.deactivated}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-gray-500">{description}</p>}
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleExportExcel}>Excel 내보내기</Button>
          <Button>새 사용자 추가</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between mb-4">
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="사용자 검색..."
                  className="pl-8 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select 
                value={statusFilter !== null ? statusFilter.toString() : "ALL"} 
                onValueChange={(value) => setStatusFilter(value === "ALL" ? null : Number(value) as AccountStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택">
                    {statusFilter !== null ? (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${userStatusColors[statusFilter].bg} ${userStatusColors[statusFilter].text}`}>
                        {userStatusLabels[statusFilter]}
                      </span>
                    ) : (
                      "전체"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  {Object.values(AccountStatus).filter(value => typeof value === 'number').map((status) => (
                    <SelectItem key={status} value={status.toString()}>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${userStatusColors[status as AccountStatus].bg} ${userStatusColors[status as AccountStatus].text}`}>
                        {userStatusLabels[status as AccountStatus]}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">닉네임</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">역할</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">로딩 중...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">사용자가 없습니다.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.indexId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.indexId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.userEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.nickname || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createDateTime).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Select
                          value={user.accountStatus.toString()}
                          onValueChange={(value) => handleStatusChange(user.indexId, Number(value) as AccountStatus)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${userStatusColors[user.accountStatus].bg} ${userStatusColors[user.accountStatus].text}`}>
                                {userStatusLabels[user.accountStatus]}
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(AccountStatus).filter(value => typeof value === 'number').map((status) => (
                              <SelectItem key={status} value={status.toString()}>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${userStatusColors[status as AccountStatus].bg} ${userStatusColors[status as AccountStatus].text}`}>
                                  {userStatusLabels[status as AccountStatus]}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="outline" size="sm" className="mr-2">편집</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.indexId)}>삭제</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              총 {totalUsers}명의 사용자
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                이전
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                다음
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement; 