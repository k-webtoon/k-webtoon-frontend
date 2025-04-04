import { FC } from 'react';
import { Card, CardContent } from "@/shared/ui/shadcn/card";

const FeedbackStatus: FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">피드백 현황</h1>
      
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">전체 피드백</h3>
            <p className="text-3xl font-bold mt-2">2,345</p>
            <p className="text-sm text-green-600 mt-2">▲ 234 이번 주</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">긍정적 피드백</h3>
            <p className="text-3xl font-bold mt-2">1,789</p>
            <p className="text-sm text-green-600 mt-2">76%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">부정적 피드백</h3>
            <p className="text-3xl font-bold mt-2">556</p>
            <p className="text-sm text-red-600 mt-2">24%</p>
          </CardContent>
        </Card>
      </div>

      {/* 피드백 목록 */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">최근 피드백</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">웹툰 추천이 정확해요</p>
                  <p className="text-sm text-gray-500">user123 • 2024-03-20</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  긍정적
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackStatus; 