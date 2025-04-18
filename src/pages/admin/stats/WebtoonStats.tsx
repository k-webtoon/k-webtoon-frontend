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
    romance: '#FFB6C1', // 연한 분홍
    action: '#FFA07A', // 연한 주황
    fantasy: '#87CEEB', // 연한 파랑
    drama: '#98FB98', // 연한 초록
    comedy: '#FFD700', // 연한 노랑
    thriller: '#DDA0DD', // 연한 보라
    sports: '#90EE90', // 연한 초록
    horror: '#D3D3D3', // 연한 회색
    mystery: '#FFC0CB', // 연한 분홍
    slice: '#ADD8E6', // 연한 하늘
    others: '#E6E6FA', // 연한 라벤더
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

  // 장르 분포 데이터 변환 및 상위 5개 장르 추출
  const genreData = Object.entries(data.genreDistribution || {})
    .map(([genre, count]) => ({
      name: genre,
      value: count || 0,
    }))
    .sort((a, b) => b.value - a.value);

  const topGenres = genreData.slice(0, 5);
  const otherGenres = genreData.slice(5);
  const otherTotal = otherGenres.reduce((sum, item) => sum + item.value, 0);

  const pieData = [
    ...topGenres,
    { name: '기타', value: otherTotal }
  ];

  // OSMU 비율 계산
  const osmuCount = data.osmuRatio ? 
    Object.values(data.osmuRatio).reduce((sum, count) => sum + (count || 0), 0) : 0;
  const osmuPercentage = data.totalCount > 0 ? (osmuCount / data.totalCount * 100) : 0;
  
  // OSMU 데이터 로깅 추가
  console.log('OSMU 데이터:', {
    osmuRatio: data.osmuRatio,
    totalCount: data.totalCount,
    osmuCount,
    osmuPercentage,
    osmuDetails: {
      영화: data.osmuRatio?.movie || 0,
      드라마: data.osmuRatio?.drama || 0,
      애니메이션: data.osmuRatio?.anime || 0,
      연극: data.osmuRatio?.play || 0,
      게임: data.osmuRatio?.game || 0,
      기타: data.osmuRatio?.ox || 0
    }
  });

  // 평균 평점과 표준편차
  const averageScore = data.scoreStats?.average || 0;
  const standardDeviation = data.scoreStats?.standardDeviation || 0;

  // 댓글 통계
  const commentCount = data.commentStats?.totalCount || 0;
  const deletedCommentRatio = data.commentStats?.deletedRatio || 0;

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">웹툰 통계</h1>
      
      {/* 주요 통계 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 웹툰 현황 */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-800">웹툰 현황</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600">전체 웹툰 수</p>
                <p className="text-2xl font-bold text-gray-800">{(data.totalCount || 0).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600">OSMU 전환</p>
                <p className="text-2xl font-bold text-gray-800">{osmuCount.toLocaleString()}</p>
                <p className="text-sm text-blue-600">전체의 {osmuPercentage.toFixed(1)}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600">평균 평점</p>
                <p className="text-2xl font-bold text-gray-800">{averageScore.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  표준편차: {standardDeviation.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600">댓글 현황</p>
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
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-800">장르별 분포</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(1)}%`}
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.name.toLowerCase()] || COLORS.others}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [`${value}개`, name]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      padding: '12px'
                    }}
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
      <Card className="bg-[#fafafa] shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800">장르별 상세 통계</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={topGenres} 
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                barCategoryGap="20%"
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  stroke="#374151"
                  tick={{ 
                    fontSize: 18, 
                    fontWeight: '600',
                    fill: '#374151'
                  }}
                  interval={0}
                  dy={10}
                />
                <YAxis 
                  stroke="#374151"
                  tick={{ 
                    fontSize: 14,
                    fill: '#374151'
                  }}
                  opacity={0.8}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}개`, '웹툰 수']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    padding: '12px',
                    fontSize: '14px'
                  }}
                  labelStyle={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '8px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  name="웹툰 수"
                  radius={[4, 4, 0, 0]}
                >
                  {topGenres.map((entry, index) => {
                    // 데이터 크기에 따른 색상 강도 계산
                    const maxValue = Math.max(...topGenres.map(g => g.value));
                    const isHighest = entry.value === maxValue;
                    
                    // 파란색 계열 색상 배열 (위에서부터 진한 순)
                    const colors = [
                      '#4A90E2', // 진한 파랑 (1등)
                      '#5DADE2', // 연한 파랑 (2등)
                      '#85C1E9', // 더 연한 파랑 (3등)
                      '#AED6F1', // 은은한 파랑 (4등)
                      '#D6EAF8'  // 하늘색 (5등)
                    ];

                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={colors[index]}
                        stroke={isHighest ? '#4A90E2' : 'none'}
                        strokeWidth={isHighest ? 1 : 0}
                        opacity={isHighest ? 1 : 0.9 - (index * 0.05)}
                      />
                    );
                  })}
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