import { FC, memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useSidebarStore } from '@/entities/admin/api/store';

interface MenuItem {
  title: string;
  path: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface AdminSidebarProps {
  onPageChange: (path: string) => void;
  activePage: string;
}

const menuGroups: MenuGroup[] = [
  {
    title: '관리',
    items: [
      { title: '사용자 관리', path: '/admin/management/users' },
      { title: '웹툰 관리', path: '/admin/management/webtoons' },
      { title: '댓글 관리', path: '/admin/management/comments' },
    ],
  },
  {
    title: '통계',
    items: [
      { title: '사용자 통계', path: '/admin/stats/users' },
      { title: '웹툰 통계', path: '/admin/stats/webtoons' },
      { title: '댓글 통계', path: '/admin/stats/comments' },
    ],
  },
  {
    title: '분석/시각화',
    items: [
      { title: '사용자 분석', path: '/admin/visualization/users' },
    ],
  },
  {
    title: '설정',
    items: [
      { title: '태그 관리', path: '/admin/settings/tags' },
    ],
  },
  {
    title: '추천 시스템',
    items: [
      { title: '피드백 현황', path: '/admin/recommendation/feedback' },
    ],
  },
];

export const AdminSidebar: FC<AdminSidebarProps> = memo(({ onPageChange, activePage }) => {
  const { openGroups, toggleGroup } = useSidebarStore();

  const isGroupOpen = useCallback((groupTitle: string) => {
    return openGroups.includes(groupTitle);
  }, [openGroups]);

  const isActivePath = useCallback((path: string) => {
    return activePage === path;
  }, [activePage]);

  // 현재 활성화된 메뉴의 그룹을 자동으로 열기
  useCallback(() => {
    menuGroups.forEach((group) => {
      if (group.items.some((item) => item.path === activePage)) {
        toggleGroup(group.title);
      }
    });
  }, [activePage, toggleGroup]);

  return (
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
            onClick={() => onPageChange('/admin')}
            className={`w-full px-4 py-2 text-left rounded-md ${activePage === '/admin'
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
                      onClick={() => onPageChange(item.path)}
                      className={`w-full px-4 py-2 text-left rounded-md ${isActivePath(item.path)
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
  );
});

AdminSidebar.displayName = 'AdminSidebar';

export default AdminSidebar; 