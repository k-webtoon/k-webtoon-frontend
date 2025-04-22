import { FC } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/shared/ui/shadcn/card";

const Stats: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const statsMenu = [
    { title: "사용자 통계", path: "/admin/stats/users" },
    { title: "작가 통계", path: "/admin/stats/authors" },
    { title: "웹툰 통계", path: "/admin/stats/webtoons" },
    { title: "댓글 통계", path: "/admin/stats/comments" },
  ];

  return (
    <>
      {/* 통계 요약 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">통계 요약</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-600">전체 사용자</h3>
              <p className="text-3xl font-bold mt-2">1,234</p>
              <p className="text-sm text-green-600 mt-2">▲ 123 이번 주</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-600">전체 작가</h3>
              <p className="text-3xl font-bold mt-2">56</p>
              <p className="text-sm text-green-600 mt-2">▲ 5 이번 주</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-600">전체 웹툰</h3>
              <p className="text-3xl font-bold mt-2">128</p>
              <p className="text-sm text-green-600 mt-2">▲ 15 이번 주</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-600">전체 댓글</h3>
              <p className="text-3xl font-bold mt-2">3,456</p>
              <p className="text-sm text-green-600 mt-2">▲ 456 이번 주</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 자식 라우트 렌더링 */}
      <Outlet />
    </>
  );
};

export default Stats;
