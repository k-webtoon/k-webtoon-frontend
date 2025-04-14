import { FC, memo } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Button } from "@/shared/ui/shadcn/button";
import { ArrowLeft } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  showBackButton?: boolean;
}

const pageTitles: Record<string, string> = {
  '/admin': '관리자 대시보드',
  '/admin/management/users': '사용자 관리',
  '/admin/management/webtoons': '웹툰 관리',
  '/admin/management/comments': '댓글 관리',
  '/admin/stats/users': '사용자 통계',
  '/admin/stats/webtoons': '웹툰 통계',
  '/admin/stats/comments': '댓글 통계',
  '/admin/visualization/users': '사용자 분석',
  '/admin/settings/tags': '태그 관리',
  '/admin/recommendation/feedback': '피드백 현황',
};

export const AdminLayout: FC<AdminLayoutProps> = memo(({
  showBackButton = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1);
  };

  const handlePageChange = (path: string) => {
    navigate(path);
  };

  const pageTitle = pageTitles[location.pathname] || '관리자 페이지';

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        <AdminSidebar onPageChange={handlePageChange} activePage={location.pathname} />

        {/* 오른쪽 콘텐츠 섹션 */}
        <div className="flex-1">
          {/* 헤더 */}
          <div className="mb-6">
            {showBackButton && (
              <Button
                variant="ghost"
                className="mb-4"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                돌아가기
              </Button>
            )}
            <h2 className="text-2xl font-bold">{pageTitle}</h2>
          </div>

          {/* 콘텐츠 */}
          <Outlet />
        </div>
      </div>
    </div>
  );
});

AdminLayout.displayName = 'AdminLayout';

export default AdminLayout; 