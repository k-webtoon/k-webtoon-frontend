import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/shadcn/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';

const UserStats: FC = () => {
  // 더미 데이터 - 월별 사용자 증가
  const monthlyData = [
    { name: '1월', users: 400 },
    { name: '2월', users: 600 },
    { name: '3월', users: 800 },
    { name: '4월', users: 1000 },
    { name: '5월', users: 1200 },
    { name: '6월', users: 1234 },
  ];

  // 더미 데이터 - 사용자 연령대 분포
  const ageData = [
    { name: '10대', value: 200 },
    { name: '20대', value: 500 },
    { name: '30대', value: 300 },
    { name: '40대', value: 150 },
    { name: '50대 이상', value: 84 },
  ];

  // 더미 데이터 - 일별 신규 가입자 수
  const dailyNewUsersData = [
    { date: '2023-06-01', newUsers: 12 },
    { date: '2023-06-02', newUsers: 19 },
    { date: '2023-06-03', newUsers: 15 },
    { date: '2023-06-04', newUsers: 22 },
    { date: '2023-06-05', newUsers: 18 },
    { date: '2023-06-06', newUsers: 25 },
    { date: '2023-06-07', newUsers: 30 },
  ];

  // 더미 데이터 - 유입 많은 시간대
  const hourlyTrafficData = [
    { hour: '00시', users: 50 },
    { hour: '01시', users: 30 },
    { hour: '02시', users: 20 },
    { hour: '03시', users: 10 },
    { hour: '04시', users: 5 },
    { hour: '05시', users: 8 },
    { hour: '06시', users: 15 },
    { hour: '07시', users: 40 },
    { hour: '08시', users: 80 },
    { hour: '09시', users: 120 },
    { hour: '10시', users: 150 },
    { hour: '11시', users: 180 },
    { hour: '12시', users: 200 },
    { hour: '13시', users: 190 },
    { hour: '14시', users: 210 },
    { hour: '15시', users: 230 },
    { hour: '16시', users: 250 },
    { hour: '17시', users: 270 },
    { hour: '18시', users: 290 },
    { hour: '19시', users: 310 },
    { hour: '20시', users: 330 },
    { hour: '21시', users: 280 },
    { hour: '22시', users: 200 },
    { hour: '23시', users: 100 },
  ];

  // 더미 데이터 - 활동 많은 유저 TOP 5
  const activeUsersData = [
    { name: '사용자1', activity: 120 },
    { name: '사용자2', activity: 98 },
    { name: '사용자3', activity: 86 },
    { name: '사용자4', activity: 75 },
    { name: '사용자5', activity: 65 },
  ];

  // 더미 데이터 - 신고 누적 사용자 TOP 5
  const reportedUsersData = [
    { name: '사용자A', reports: 15 },
    { name: '사용자B', reports: 12 },
    { name: '사용자C', reports: 10 },
    { name: '사용자D', reports: 8 },
    { name: '사용자E', reports: 6 },
  ];

  // 색상 테마
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const GRADIENT_COLORS = {
    primary: ['#3B82F6', '#60A5FA'],
    success: ['#10B981', '#34D399'],
    warning: ['#F59E0B', '#FBBF24'],
    danger: ['#EF4444', '#F87171'],
    purple: ['#8B5CF6', '#A78BFA'],
  };

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '8px',
      border: 'none',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
  };

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">사용자 통계</h1>
      
      {/* 주요 통계 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 주요 통계 카드 */}
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">주요 통계</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">일일 활성 사용자</p>
                <p className="text-2xl font-bold text-gray-800">856</p>
                <p className="text-sm text-green-600">+5.3% 증가</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">월간 활성 사용자</p>
                <p className="text-2xl font-bold text-gray-800">1,234</p>
                <p className="text-sm text-green-600">+12.8% 증가</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">평균 체류 시간</p>
                <p className="text-2xl font-bold text-gray-800">25분</p>
                <p className="text-sm text-gray-500">전월 대비 동일</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">신규 가입률</p>
                <p className="text-2xl font-bold text-gray-800">+12.5%</p>
                <p className="text-sm text-green-600">목표 달성률 95%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 전체 통계 요약 */}
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">사용자 통계</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">전체 사용자 수</p>
                  <p className="text-2xl font-bold text-gray-800">5,678</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">최근 7일 접속자 수</p>
                  <p className="text-2xl font-bold text-gray-800">1,234</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">최근 30일 접속자 수</p>
                  <p className="text-2xl font-bold text-gray-800">4,567</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 메인 차트와 탭 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 메인 차트 (일별 신규 가입자 수) */}
        <Card className="lg:col-span-3 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">일별 신규 가입자 수</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyNewUsersData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={GRADIENT_COLORS.success[0]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={GRADIENT_COLORS.success[1]} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip {...tooltipStyle} />
                  <Area 
                    type="monotone" 
                    dataKey="newUsers" 
                    stroke={GRADIENT_COLORS.success[0]} 
                    fillOpacity={1} 
                    fill="url(#colorNewUsers)" 
                    name="신규 가입자" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 탭으로 전환되는 차트들 */}
        <Card className="lg:col-span-2 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
            <Tabs defaultValue="monthly" className="space-y-4">
              <TabsList className="grid grid-cols-4 gap-4 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="monthly" className="data-[state=active]:bg-white">월별</TabsTrigger>
                <TabsTrigger value="age" className="data-[state=active]:bg-white">연령대</TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-white">활동</TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-white">신고</TabsTrigger>
              </TabsList>

              <TabsContent value="monthly" className="mt-4">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip {...tooltipStyle} />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke={GRADIENT_COLORS.primary[0]} 
                        strokeWidth={2}
                        dot={{ fill: GRADIENT_COLORS.primary[0], strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="age" className="mt-4">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip {...tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="active" className="mt-4">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activeUsersData} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" stroke="#6B7280" />
                      <YAxis dataKey="name" type="category" stroke="#6B7280" />
                      <Tooltip {...tooltipStyle} />
                      <Bar 
                        dataKey="activity" 
                        fill={GRADIENT_COLORS.success[0]} 
                        radius={[0, 4, 4, 0]}
                        name="활동 점수" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="mt-4">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportedUsersData} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" stroke="#6B7280" />
                      <YAxis dataKey="name" type="category" stroke="#6B7280" />
                      <Tooltip {...tooltipStyle} />
                      <Bar 
                        dataKey="reports" 
                        fill={GRADIENT_COLORS.danger[0]} 
                        radius={[0, 4, 4, 0]}
                        name="신고 수" 
                      />
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

export default UserStats; 