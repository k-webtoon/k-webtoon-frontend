import { FC } from 'react';
import { Card, CardContent } from "@/shared/ui/shadcn/card";

const UserStats: FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">사용자 통계</h1>
      
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">전체 사용자</h3>
            <p className="text-3xl font-bold mt-2">1,234</p>
            <p className="text-sm text-green-600 mt-2">▲ 123 이번 주</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">활성 사용자</h3>
            <p className="text-3xl font-bold mt-2">789</p>
            <p className="text-sm text-green-600 mt-2">▲ 45 이번 주</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">신규 가입</h3>
            <p className="text-3xl font-bold mt-2">56</p>
            <p className="text-sm text-green-600 mt-2">▲ 12 이번 주</p>
          </CardContent>
        </Card>
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">사용자 증가 추이</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              차트가 들어갈 영역
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">활성도 분석</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              차트가 들어갈 영역
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserStats; 