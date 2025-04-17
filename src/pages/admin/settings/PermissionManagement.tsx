import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";
import { Button } from "@/shared/ui/shadcn/button";
import { Input } from "@/shared/ui/shadcn/input";
import { Search } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  role: string;
}

const PermissionManagement: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // TODO: API 연동 시 실제 데이터로 교체
  useEffect(() => {
    // 임시 데이터
    setUsers([
      { id: 1, username: 'test07', email: 'test07@example.com', createdAt: '2022-04-29', role: 'ROLE_USER' },
      { id: 2, username: 'user02', email: 'user02@example.com', createdAt: '2022-04-28', role: 'ROLE_USER' },
    ]);
    setAdminUsers([
      { id: 3, username: 'admin01', email: 'admin01@example.com', createdAt: '2022-04-27', role: 'ROLE_ADMIN' },
    ]);
  }, []);

  const handleAddAdmin = async (user: User) => {
    setLoading(true);
    try {
      // TODO: API 호출 구현
      // await api.post('/api/admin/permissions/add-admin', { userId: user.id });
      
      // 임시 상태 업데이트
      setUsers(users.filter(u => u.id !== user.id));
      setAdminUsers([...adminUsers, { ...user, role: 'ROLE_ADMIN' }]);
    } catch (error) {
      alert('관리자 권한 부여 중 오류가 발생했습니다.');
      console.error('권한 변경 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (admin: User) => {
    setLoading(true);
    try {
      // TODO: API 호출 구현
      // await api.post('/api/admin/permissions/remove-admin', { userId: admin.id });
      
      // 임시 상태 업데이트
      setAdminUsers(adminUsers.filter(u => u.id !== admin.id));
      setUsers([...users, { ...admin, role: 'ROLE_USER' }]);
    } catch (error) {
      alert('관리자 권한 해제 중 오류가 발생했습니다.');
      console.error('권한 변경 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">권한 관리</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 전체 사용자 목록 */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-800">전체 사용자</CardTitle>
            <div className="relative mt-4">
              <Input
                type="text"
                placeholder="사용자 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {filteredUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Button
                    onClick={() => handleAddAdmin(user)}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    관리자 추가
                  </Button>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 관리자 목록 */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-800">관리자 목록</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {adminUsers.map(admin => (
                <div key={admin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{admin.username}</p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>
                  <Button
                    onClick={() => handleRemoveAdmin(admin)}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    관리자 해제
                  </Button>
                </div>
              ))}
              {adminUsers.length === 0 && (
                <p className="text-center text-gray-500">관리자가 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PermissionManagement; 