import { FC, useState } from 'react';
import { Button } from '@/shared/ui/shadcn/button';
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

const WebtoonManagement: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<string[]>(['사용자 관리']);

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
          {/* 웹툰 관리 헤더 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">웹툰 관리</h2>
              <div className="flex gap-4">
                <Button variant="outline">엑셀 다운로드</Button>
                <Button>새 웹툰 등록</Button>
              </div>
            </div>

            {/* 검색 및 필터 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                type="text"
                placeholder="웹툰 검색..."
                className="px-4 py-2 border rounded-md"
              />
              <select className="px-4 py-2 border rounded-md">
                <option value="">장르 선택</option>
                <option value="action">액션</option>
                <option value="romance">로맨스</option>
                <option value="comedy">코미디</option>
              </select>
              <select className="px-4 py-2 border rounded-md">
                <option value="">상태 선택</option>
                <option value="ongoing">연재중</option>
                <option value="completed">완결</option>
                <option value="hiatus">휴재</option>
              </select>
            </div>

            {/* 웹툰 목록 */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      썸네일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      제목
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작가
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      장르
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
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src="/images/webtoon-placeholder.jpg"
                        alt="웹툰 썸네일"
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">샘플 웹툰</td>
                    <td className="px-6 py-4 whitespace-nowrap">작가명</td>
                    <td className="px-6 py-4 whitespace-nowrap">액션</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        연재중
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="outline" size="sm" className="mr-2">
                        수정
                      </Button>
                      <Button variant="destructive" size="sm">
                        삭제
                      </Button>
                    </td>
                  </tr>
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
      </div>
    </div>
  );
};

export default WebtoonManagement; 