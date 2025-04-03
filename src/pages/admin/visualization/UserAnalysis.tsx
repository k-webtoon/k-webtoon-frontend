import { FC } from 'react';
import { Card, CardContent } from "@/shared/ui/shadcn/card";

const UserAnalysis: FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">사용자 분석</h1>
      
      {/* 차트 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">연령대별 분포</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              파이 차트가 들어갈 영역
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">성별 분포</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              막대 차트가 들어갈 영역
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">사용자 활동 추이</h3>
            <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
              라인 차트가 들어갈 영역
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 분석 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">평균 체류 시간</h3>
            <p className="text-3xl font-bold mt-2">24분</p>
            <p className="text-sm text-green-600 mt-2">▲ 5분 이번 주</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">평균 방문 횟수</h3>
            <p className="text-3xl font-bold mt-2">3.5회</p>
            <p className="text-sm text-green-600 mt-2">▲ 0.5회 이번 주</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">이용률</h3>
            <p className="text-3xl font-bold mt-2">68%</p>
            <p className="text-sm text-green-600 mt-2">▲ 3% 이번 주</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAnalysis; 