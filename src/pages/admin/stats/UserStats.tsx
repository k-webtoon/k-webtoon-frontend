import { FC, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/shadcn/tabs";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useUserStatsStore } from '@/entities/admin/store/userStatsStore';

const UserStats: FC = () => {
  const { data, loading, error, fetchUserStats } = useUserStatsStore();

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="flex items-center justify-center h-screen">데이터가 없습니다.</div>;
  }

  console.log('성별 분포 데이터:', data.genderDistribution);
  console.log('상태 분포 데이터:', data.userStatusRatio);

  const COLORS = {
    MALE: '#4C6EF5',
    FEMALE: '#FA5252',
    ACTIVE: '#40C057',
    SUSPENDED: '#FAB005',
    DEACTIVATED: '#868E96'
  } as const;

  const AGE_COLORS = ['#748FFC', '#51CF66', '#FCC419', '#FF6B6B', '#845EF7'];

  // 연령대 데이터 정렬
  const sortedAgeData = [...data.ageDistribution].sort((a, b) => {
    const ageOrder = ['10대', '20대', '30대', '40대', '50대'];
    return ageOrder.indexOf(a.ageGroup) - ageOrder.indexOf(b.ageGroup);
  });

  // 최근 7일 가입자 수 계산
  const recentSignups = data.dailySignups.slice(-7).reduce((sum, item) => sum + item.count, 0);

  // 활성 사용자 비율 계산
  const activeUserRatio = data.userStatusRatio.find(r => r.status === 'ACTIVE')?.ratio || 0;

  // 일평균 활동량 계산
  const totalActivity = data.genderAgeActivity.reduce((sum, item) => sum + item.activityCount, 0);
  const daysInPeriod = 30; // 기본값으로 30일 설정
  const averageActivity = Math.round(totalActivity / daysInPeriod);

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '8px',
      border: 'none',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '8px 12px'
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{label || payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].value.toLocaleString()}
            {payload[0].unit || '명'}
          </p>
        </div>
      );
    }
    return null;
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
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">전체 사용자 수</p>
                <p className="text-2xl font-bold text-blue-600">{data.totalCount.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">최근 7일 가입자</p>
                <p className="text-2xl font-bold text-green-600">{recentSignups.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">활성 사용자 비율</p>
                <p className="text-2xl font-bold text-purple-600">{(activeUserRatio * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">일평균 활동량</p>
                <p className="text-2xl font-bold text-orange-600">{averageActivity.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 성별 분포 */}
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">성별 분포</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.genderDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => 
                      `${name === 'MALE' ? '남성' : '여성'} ${(percent * 100).toFixed(1)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="ratio"
                  >
                    {data.genderDistribution.map((entry) => (
                      <Cell 
                        key={`cell-${entry.gender}`} 
                        fill={entry.gender === 'MALE' ? COLORS.MALE : COLORS.FEMALE}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        const gender = data.payload.gender === 'MALE' ? '남성' : '여성';
                        const count = Math.round(data.payload.ratio * data.payload.totalCount);
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
                            <p className="text-sm font-medium text-gray-900">{gender}</p>
                            <p className="text-sm text-gray-600">{count.toLocaleString()}명</p>
                            <p className="text-sm text-gray-600">({(data.payload.ratio * 100).toFixed(1)}%)</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 통계 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 일별 가입자 수 차트 */}
        <Card className="lg:col-span-3 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">일별 가입자 수</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={data.dailySignups} 
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4C6EF5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4C6EF5" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    tickFormatter={(value) => value.split('-').slice(1).join('/')}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        if (!data) return null;
                        
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
                            <p className="text-sm font-medium text-gray-900">{label}</p>
                            <p className="text-sm text-gray-600">
                              {(data.value || 0).toLocaleString()}명 가입
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#4C6EF5" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorSignups)" 
                    name="신규 가입자" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 연령대 및 상태 분포 */}
        <Card className="lg:col-span-2 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
            <Tabs defaultValue="age" className="space-y-4">
              <TabsList className="grid grid-cols-2 gap-4 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="age" className="data-[state=active]:bg-white">연령대</TabsTrigger>
                <TabsTrigger value="status" className="data-[state=active]:bg-white">상태</TabsTrigger>
              </TabsList>

              <TabsContent value="age" className="mt-4">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={sortedAgeData} 
                      layout="vertical" 
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" stroke="#6B7280" />
                      <YAxis 
                        dataKey="ageGroup" 
                        type="category" 
                        stroke="#6B7280"
                        tick={{ fontSize: 13 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" name="사용자 수">
                        {sortedAgeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={AGE_COLORS[index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="status" className="mt-4">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.userStatusRatio}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="ratio"
                      >
                        {data.userStatusRatio.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.status as keyof typeof COLORS]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
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