import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/shadcn/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const WebtoonStats: FC = () => {
  // 더미 데이터 - 웹툰 상태별 수
  const statusData = [
    { name: 'ACTIVE', value: 120 },
    { name: 'INACTIVE', value: 30 },
    { name: 'DRAFT', value: 15 },
    { name: 'REPORTED', value: 5 },
  ];

  // 더미 데이터 - 별점 평균 상위
  const ratingData = [
    { name: '연애혁명', rating: 4.9, episodes: 150 },
    { name: '화산귀환', rating: 4.8, episodes: 89 },
    { name: '독립일기', rating: 4.7, episodes: 220 },
    { name: '여신강림', rating: 4.7, episodes: 190 },
    { name: '전지적 독자 시점', rating: 4.6, episodes: 102 },
  ];

  // 더미 데이터 - 최근 등록된 웹툰
  const recentData = [
    { name: '신규웹툰1', date: '2024-03-14', genre: '로맨스' },
    { name: '신규웹툰2', date: '2024-03-13', genre: '액션' },
    { name: '신규웹툰3', date: '2024-03-12', genre: '판타지' },
    { name: '신규웹툰4', date: '2024-03-11', genre: '일상' },
    { name: '신규웹툰5', date: '2024-03-10', genre: '스릴러' },
  ];

  // 더미 데이터 - 활동량 상위
  const activityData = [
    { name: '연애혁명', comments: 1200, likes: 5000, views: 120000 },
    { name: '화산귀환', comments: 980, likes: 4500, views: 100000 },
    { name: '독립일기', comments: 850, likes: 4000, views: 95000 },
    { name: '여신강림', comments: 820, likes: 3800, views: 90000 },
    { name: '전지적 독자 시점', comments: 780, likes: 3500, views: 85000 },
  ];

  const COLORS = {
    primary: '#3B82F6',
    secondary: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6',
  };

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '8px',
      border: 'none',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
  };

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">웹툰 통계</h1>
      
      {/* 주요 통계 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 웹툰 현황 */}
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">웹툰 현황</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">전체 웹툰 수</p>
                <p className="text-2xl font-bold text-gray-800">170</p>
                <p className="text-sm text-green-600">▲ 15 이번 달</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">신고된 웹툰</p>
                <p className="text-2xl font-bold text-gray-800">5</p>
                <p className="text-sm text-red-600">긴급 검토 필요</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">OSMU 전환</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
                <p className="text-sm text-blue-600">전체의 7%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">평균 별점</p>
                <p className="text-2xl font-bold text-gray-800">4.5</p>
                <p className="text-sm text-green-600">▲ 0.2 상승</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 활동 현황 */}
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">활동 현황</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">월간 총 조회수</p>
                  <p className="text-2xl font-bold text-gray-800">5.2M</p>
                  <p className="text-sm text-green-600">▲ 12% 전월 대비</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">월간 총 활동량</p>
                  <p className="text-2xl font-bold text-gray-800">89.5K</p>
                  <p className="text-sm text-green-600">▲ 8% 전월 대비</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 메인 차트와 탭 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 메인 차트 (상태별 웹툰 분포) */}
        <Card className="lg:col-span-3 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">상태별 웹툰 분포</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name} (${value}개, ${(percent * 100).toFixed(0)}%)`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 탭으로 전환되는 차트들 */}
        <Card className="lg:col-span-2 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
            <Tabs defaultValue="rating" className="space-y-4">
              <TabsList className="grid grid-cols-4 gap-4 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="rating" className="data-[state=active]:bg-white">별점</TabsTrigger>
                <TabsTrigger value="recent" className="data-[state=active]:bg-white">최신</TabsTrigger>
                <TabsTrigger value="comments" className="data-[state=active]:bg-white">댓글</TabsTrigger>
                <TabsTrigger value="likes" className="data-[state=active]:bg-white">좋아요</TabsTrigger>
              </TabsList>

              <TabsContent value="rating" className="mt-4">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ratingData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 5]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip {...tooltipStyle} />
                      <Bar dataKey="rating" fill={COLORS.primary} name="평균 별점" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="recent" className="mt-4">
                <div className="space-y-2">
                  {recentData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.genre}</p>
                      </div>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="mt-4">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip {...tooltipStyle} />
                      <Bar dataKey="comments" fill={COLORS.secondary} name="댓글 수" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="likes" className="mt-4">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip {...tooltipStyle} />
                      <Bar dataKey="likes" fill={COLORS.purple} name="좋아요 수" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebtoonStats; 