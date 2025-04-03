import { FC, useState } from 'react';
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface MenuGroup {
  title: string;
  icon?: string;
  items: {
    title: string;
    path: string;
  }[];
}

const menuGroups: MenuGroup[] = [
  {
    title: '사용자 관리',
    items: [
      { title: '사용자 관리', path: '/admin/user' },
      { title: '작가/웹툰 관리', path: '/admin/webtoon' },
      { title: '사용자 통계', path: '/admin/user-stats' },
    ],
  },
  {
    title: '추천 시스템',
    items: [
      { title: '피드백 현황', path: '/admin/feedback' },
      { title: '알고리즘 설정', path: '/admin/algorithm' },
      { title: '정확도 분석', path: '/admin/accuracy' },
    ],
  },
  {
    title: '시각화',
    items: [
      { title: '사용자 분석', path: '/admin/visualization/users' },
      { title: '웹툰 분석', path: '/admin/visualization/webtoons' },
      { title: '트렌드 분석', path: '/admin/visualization/trends' },
    ],
  },
  {
    title: '시스템 설정',
    items: [
      { title: '태그 관리', path: '/admin/tags' },
      { title: '알림', path: '/admin/notifications' },
      { title: '공지사항', path: '/admin/announcements' },
    ],
  },
];

const AdminMain: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<string[]>(['사용자 관리']); // 기본적으로 첫 번째 그룹 열기

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups(prev => 
      prev.includes(groupTitle)
        ? prev.filter(title => title !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const isGroupOpen = (groupTitle: string) => openGroups.includes(groupTitle);
  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 왼쪽 관리자 정보 섹션 */}
        <div className="w-full md:w-1/4">
          <div className="sticky top-24">
            <div className="mb-4">
              <div className="w-full aspect-square rounded-full border-4 border-white shadow-lg overflow-hidden mb-4">
                <img
                  src="/images/admin-placeholder.jpg"
                  alt="관리자"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold mb-1">관리자</h1>
              <p className="text-gray-600 mb-4">admin@kwebtoon.com</p>
            </div>

            {/* 관리자 메뉴 네비게이션 */}
            <nav className="space-y-1">
              {/* 대시보드 버튼 */}
              <button 
                onClick={() => navigate('/admin')}
                className={`w-full px-4 py-2 text-left rounded-md ${
                  location.pathname === '/admin' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                대시보드
              </button>

              {/* 메뉴 그룹 */}
              {menuGroups.map((group) => (
                <div key={group.title} className="space-y-1">
                  {/* 그룹 헤더 */}
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="w-full px-4 py-2 text-left rounded-md text-gray-600 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>{group.title}</span>
                    {isGroupOpen(group.title) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {/* 하위 메뉴 */}
                  {isGroupOpen(group.title) && (
                    <div className="pl-4 space-y-1">
                      {group.items.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => navigate(item.path)}
                          className={`w-full px-4 py-2 text-left rounded-md ${
                            isActivePath(item.path)
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* 오른쪽 콘텐츠 섹션 */}
        <div className="flex-1">
          {/* 통계 요약 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">통계 요약</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-600">전체 웹툰</h3>
                  <p className="text-3xl font-bold mt-2">128</p>
                  <p className="text-sm text-green-600 mt-2">▲ 15 이번 주</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-600">전체 사용자</h3>
                  <p className="text-3xl font-bold mt-2">1,234</p>
                  <p className="text-sm text-green-600 mt-2">▲ 123 이번 주</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-600">전체 리뷰</h3>
                  <p className="text-3xl font-bold mt-2">3,456</p>
                  <p className="text-sm text-green-600 mt-2">▲ 456 이번 주</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-600">활성 사용자</h3>
                  <p className="text-3xl font-bold mt-2">789</p>
                  <p className="text-sm text-red-600 mt-2">▼ 12 이번 주</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">최근 활동</h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 border rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium">새로운 웹툰 등록</p>
                  <p className="text-sm text-gray-500">2024-03-20 15:30</p>
                </div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium">사용자 신고 접수</p>
                  <p className="text-sm text-gray-500">2024-03-20 14:25</p>
                </div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium">시스템 업데이트</p>
                  <p className="text-sm text-gray-500">2024-03-20 13:15</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMain; 