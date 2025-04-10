import { FC, useState } from 'react';
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

const UserManagement: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<string | undefined>(undefined);

  // 더미 데이터
  const users = [
    { id: 1, name: '홍길동', email: 'hong@example.com', joinDate: '2024-03-20', status: 'active' },
    { id: 2, name: '김철수', email: 'kim@example.com', joinDate: '2024-03-19', status: 'inactive' },
    { id: 3, name: '이영희', email: 'lee@example.com', joinDate: '2024-03-18', status: 'suspended' },
  ];

  // 필터링된 사용자 목록
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === 'latest') {
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
      }
      return 0;
    });

  // 상태별 사용자 수 계산
  const userStats = {
    total: users.length,
    active: users.filter(user => user.status === 'active').length,
    inactive: users.filter(user => user.status === 'inactive').length,
    suspended: users.filter(user => user.status === 'suspended').length,
  };

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-600">전체 사용자</h3>
            <p className="text-2xl font-bold mt-1">{userStats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-600">활성 사용자</h3>
            <p className="text-2xl font-bold mt-1 text-green-600">{userStats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-600">비활성 사용자</h3>
            <p className="text-2xl font-bold mt-1 text-gray-600">{userStats.inactive}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-600">정지된 사용자</h3>
            <p className="text-2xl font-bold mt-1 text-red-600">{userStats.suspended}</p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">사용자 관리</h2>
          <div className="flex gap-4">
            <Button variant="outline">엑셀 다운로드</Button>
            <Button variant="outline">엑셀 업로드</Button>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="이름 또는 이메일로 검색..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="inactive">비활성</SelectItem>
              <SelectItem value="suspended">정지</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger>
              <SelectValue placeholder="가입일 순" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="oldest">오래된순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 사용자 목록 */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  프로필
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src="/images/profile-placeholder.jpg"
                      alt={`${user.name}의 프로필`}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.joinDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? '활성' :
                       user.status === 'inactive' ? '비활성' : '정지'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="outline" size="sm" className="mr-2">
                      수정
                    </Button>
                    <Button variant="destructive" size="sm">
                      정지
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-2">
            <Button variant="outline" size="sm">이전</Button>
            <Button variant="outline" size="sm" className="bg-blue-50">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">다음</Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default UserManagement; 