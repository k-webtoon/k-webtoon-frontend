import { FC } from 'react';
import { Card, CardContent } from "@/shared/ui/shadcn/card";

const AdminMain: FC = () => {
  return (
    <div className="space-y-8">
      {/* 통계 요약 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
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
  );
};

export default AdminMain; 