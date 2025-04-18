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
  Legend,
} from 'recharts';
import { useUserStatsStore } from '@/entities/admin/store/userStatsStore';

const UserStats: FC = () => {
  const { data, loading, error, fetchUserStats } = useUserStatsStore();

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  // API 응답 데이터 디버깅
  useEffect(() => {
    if (data) {
      console.log('전체 데이터:', data);
      console.log('성별 분포 원본:', data.genderDistribution);
      console.log('상태 비율 원본:', data.userStatusRatio);
    }
  }, [data]);

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
    FEMALE: '#EC4899',
    ACTIVE: '#10B981',
    SUSPENDED: '#F59E0B',
    DEACTIVATED: '#6B7280'
  } as const;

  const AGE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

  const chartTheme = {
    grid: {
      stroke: '#E5E7EB',
      strokeDasharray: '3 3',
    },
    axis: {
      stroke: '#6B7280',
      fontSize: 12,
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '12px',
    },
  };

  // 연령대 데이터 정렬
  const sortedAgeData = data?.ageDistribution?.map(item => ({
    label: item.ageGroup,
    value: item.count || 0
  })).sort((a, b) => {
    const ageOrder = ['10대', '20대', '30대', '40대', '50대'];
    return ageOrder.indexOf(a.label) - ageOrder.indexOf(b.label);
  }) || [];

  // 성별 데이터 변환
  const genderData = (() => {
    if (!data?.genderDistribution) return [];
    
    const totalCount = data.genderDistribution.reduce((sum, item) => sum + Number(item.count), 0);
    
    return data.genderDistribution.map(item => ({
      name: item.gender === '남' ? '남성' : '여성',
      value: totalCount > 0 ? Number(item.count) / totalCount : 0,
      count: Number(item.count)
    }));
  })();

  console.log('변환된 성별 데이터:', genderData);

  // 상태 데이터 변환
  const statusData = (() => {
    if (!data?.userStatusRatio) return [];
    
    const totalCount = data.userStatusRatio.reduce((sum, item) => sum + Number(item.count), 0);
    
    return data.userStatusRatio.map(item => ({
      name: item.status === 'ACTIVE' ? '활성' : 
           item.status === 'SUSPENDED' ? '정지' : '비활성',
      value: Number(item.count),
      count: Number(item.count),
      ratio: totalCount > 0 ? Number(item.count) / totalCount : 0
    }));
  })();

  // 최근 7일 가입자 수 계산
  const recentSignups = data?.dailySignups?.slice(-7).reduce((sum, item) => sum + (item.count || 0), 0) || 0;

  // 활성 사용자 비율 계산
  const activeUserRatio = data?.userStatusRatio?.find(r => r.status === 'ACTIVE')?.ratio || 0;

  // 일평균 활동량 계산
  const totalActivity = data?.genderAgeActivity?.reduce((sum, item) => sum + (item.activityCount || 0), 0) || 0;
  const daysInPeriod = 30;
  const averageActivity = Math.round(totalActivity / daysInPeriod);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
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

  const CustomLabel = ({ cx, cy, value, total }: { cx: number, cy: number, value: number, total: number }) => (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-2xl font-bold fill-gray-800"
    >
      {total}명
    </text>
  );

  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">
            {entry.value} ({Math.round(entry.payload.ratio * 100)}%)
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">사용자 통계</h1>
      
      {/* 주요 통계 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 주요 통계 카드 */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-gray-800">주요 통계</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-gray-600">전체 사용자 수</p>
                <p className="text-2xl font-bold text-blue-600">{data.totalCount.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-sm text-gray-600">최근 7일 가입자</p>
                <p className="text-2xl font-bold text-green-600">{recentSignups.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <p className="text-sm text-gray-600">활성 사용자 비율</p>
                <p className="text-2xl font-bold text-purple-600">{(activeUserRatio * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <p className="text-sm text-gray-600">일평균 활동량</p>
                <p className="text-2xl font-bold text-orange-600">{averageActivity.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 성별 분포 */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-gray-800">성별 분포</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, count }) => `${name}\n${Math.round(value * 100)}%\n(${count}명)`}
                    outerRadius={80}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {genderData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={entry.name === '남성' ? COLORS.MALE : COLORS.FEMALE}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={CustomTooltip} />
                  <CustomLabel 
                    cx={150} 
                    cy={150} 
                    value={data.totalCount} 
                    total={data.totalCount} 
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
        <Card className="lg:col-span-3 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-gray-800">일별 가입자 수</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={data.dailySignups} 
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  barCategoryGap="10%"
                  barGap={0}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5DADE2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#85C1E9" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#eee" 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    tickFormatter={(value) => {
                      const [month, day] = value.split('-').slice(1);
                      return `${month}/${day}`;
                    }}
                    tick={{ fontSize: 12 }}
                    interval={4} // 5일마다 표시
                  />
                  <YAxis 
                    stroke="#6B7280"
                    tickFormatter={(value) => value.toLocaleString()}
                    tick={{ fontSize: 12 }}
                    domain={[0, 5]} // y축 최대값 5로 고정
                  />
                  <Tooltip 
                    content={CustomTooltip}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    name="신규 가입자"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {data.dailySignups.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={entry.count > 0 ? "url(#barGradient)" : '#E5E7EB'}
                        stroke="#fff"
                        strokeWidth={1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 연령대 및 상태 분포 */}
        <Card className="lg:col-span-2 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
          <CardContent className="p-4">
            <Tabs defaultValue="age" className="space-y-4">
              <TabsList className="grid grid-cols-2 gap-4 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="age" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">연령대</TabsTrigger>
                <TabsTrigger value="status" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">상태</TabsTrigger>
              </TabsList>

              <TabsContent value="age" className="mt-4">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sortedAgeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}\n${value}명`}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {sortedAgeData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={AGE_COLORS[index]}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={CustomTooltip} />
                      <Legend content={CustomLegend} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="status" className="mt-4">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, ratio }) => `${name}\n${value}명\n(${Math.round(ratio * 100)}%)`}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                        minAngle={5} // 최소 각도 설정으로 작은 데이터도 표시
                      >
                        {statusData.map((entry) => (
                          <Cell 
                            key={`cell-${entry.name}`} 
                            fill={entry.name === '활성' ? COLORS.ACTIVE : 
                                  entry.name === '정지' ? COLORS.SUSPENDED : 
                                  COLORS.DEACTIVATED}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-900">{data.name}</p>
                                <p className="text-sm text-gray-600">
                                  {data.value}명 ({Math.round(data.ratio * 100)}%)
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend content={CustomLegend} />
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