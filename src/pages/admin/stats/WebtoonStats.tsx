import { FC, useEffect } from 'react';
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
import { useWebtoonStatsStore } from '@/entities/admin/store/webtoonStatsStore';

const WebtoonStats: FC = () => {
  const { data, loading, error, fetchWebtoonStats } = useWebtoonStatsStore();

  useEffect(() => {
    fetchWebtoonStats();
  }, [fetchWebtoonStats]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="flex items-center justify-center h-screen">데이터가 없습니다.</div>;
  }

  // 색상 테마 업데이트
  const COLORS: Record<string, string> = {
    romance: '#FF69B4', // 분홍색
    action: '#FF6B6B', // 빨간색
    fantasy: '#4DABF7', // 파란색
    drama: '#20C997', // 청록색
    comedy: '#FCC419', // 노란색
    thriller: '#845EF7', // 보라색
    sports: '#51CF66', // 초록색
    horror: '#495057', // 어두운 회색
    mystery: '#F06595', // 연한 분홍
    slice: '#339AF0', // 하늘색
  };

  const GRADIENT_COLORS = {
    primary: ['#748FFC', '#4C6EF5'],
    secondary: ['#51CF66', '#37B24D'],
    warning: ['#FFD43B', '#FAB005'],
    danger: ['#FF6B6B', '#FA5252'],
    purple: ['#845EF7', '#7048E8'],
  };

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '8px',
      border: 'none',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
  };

  // 장르 분포 데이터 변환
  const genreData = Object.entries(data.genreDistribution || {}).map(([genre, count]) => ({
    name: genre,
    value: count || 0,
  }));

  // OSMU 비율 계산
  const osmuCount = data.osmuRatio?.CONVERTED || 0;
  const osmuPercentage = data.totalCount > 0 ? (osmuCount / data.totalCount * 100) : 0;

  // 평균 평점과 표준편차
  const averageScore = data.scoreStats?.average || 0;
  const standardDeviation = data.scoreStats?.standardDeviation || 0;

  // 댓글 통계
  const commentCount = data.commentStats?.totalCount || 0;
  const deletedCommentRatio = data.commentStats?.deletedRatio || 0;

  // 커스텀 라벨 렌더링 함수
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.2; // 라벨을 차트 바깥으로 더 멀리
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // 퍼센트가 3% 미만인 경우 레이블 생략
    if (percent < 0.03) return null;

    return (
      <text
        x={x}
        y={y}
        fill={COLORS[name.toLowerCase()] || '#666'}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${name} (${value}개, ${(percent * 100).toFixed(0)}%)`}
      </text>
    );
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
                <p className="text-2xl font-bold text-gray-800">{(data.totalCount || 0).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">OSMU 전환</p>
                <p className="text-2xl font-bold text-gray-800">{osmuCount.toLocaleString()}</p>
                <p className="text-sm text-blue-600">전체의 {osmuPercentage.toFixed(1)}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">평균 평점</p>
                <p className="text-2xl font-bold text-gray-800">{averageScore.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  표준편차: {standardDeviation.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">댓글 현황</p>
                <p className="text-2xl font-bold text-gray-800">
                  {commentCount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  삭제율: {(deletedCommentRatio * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 장르 분포 */}
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">장르별 분포</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {genreData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.name.toLowerCase()] || Object.values(COLORS)[index % Object.values(COLORS).length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    {...tooltipStyle}
                    formatter={(value: number, name: string) => [`${value}개`, name]}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      paddingTop: '20px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 장르별 상세 통계 */}
      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">장르별 상세 통계</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genreData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip {...tooltipStyle} />
                <Bar 
                  dataKey="value" 
                  name="웹툰 수"
                >
                  {genreData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name.toLowerCase()] || Object.values(COLORS)[index % Object.values(COLORS).length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebtoonStats; 