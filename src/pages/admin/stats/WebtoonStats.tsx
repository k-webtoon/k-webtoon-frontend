import { FC, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";
import { statsApi } from '@/entities/admin/api/stats';
import { WebtoonStatsResponse, DateRange } from '@/entities/admin/api/stats/types';
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

// WebtoonStatsResponse 타입 예시:
/*
{
  summary: {
    totalWebtoons: number;      // 전체 웹툰 수
    reportedWebtoons: number;   // 신고된 웹툰 수
    osmConversions: number;     // OSM 전환 수
    averageRating: number;      // 평균 평점
  },
  statusDistribution: Array<{   // 상태별 분포
    status: string;            // 상태 (연재중, 완결, 휴재 등)
    count: number;             // 해당 상태의 웹툰 수
  }>,
  topRatedWebtoons: Array<{    // 인기 웹툰 TOP 5
    name: string;              // 웹툰 제목
  }>,
  recentWebtoons: Array<{      // 최근 등록된 웹툰
    name: string;              // 웹툰 제목
    date: string;              // 등록일
    genre: string;             // 장르
  }>,
  activityStats: Array<{       // 활동 통계
    name: string;              // 웹툰 제목
    comments: number;          // 댓글 수
    likes: number;             // 좋아요 수
    views: number;             // 조회수
  }>
}
*/

interface WebtoonStatsProps {
  dateRange: DateRange;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const WebtoonStats: FC<WebtoonStatsProps> = ({ dateRange }) => {
  const [webtoonStats, setWebtoonStats] = useState<WebtoonStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebtoonStats = async () => {
      try {
        const response = await statsApi.getWebtoonStats({
          ...dateRange,
          type: 'webtoons'
        });
        setWebtoonStats(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || '웹툰 통계를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWebtoonStats();
  }, [dateRange]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg">로딩 중...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg text-red-500">{error}</div>
    </div>
  );

  if (!webtoonStats) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg">데이터가 없습니다.</div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">전체 웹툰</h3>
            <p className="text-3xl font-bold mt-2">{webtoonStats.summary.totalWebtoons}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">신고된 웹툰</h3>
            <p className="text-3xl font-bold mt-2">{webtoonStats.summary.reportedWebtoons}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">OSM 전환</h3>
            <p className="text-3xl font-bold mt-2">{webtoonStats.summary.osmConversions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">총 조회수</h3>
            <p className="text-3xl font-bold mt-2">{webtoonStats.summary.totalViews}</p>
          </CardContent>
        </Card>
      </div>

      {/* 월간 통계 */}
      <Card>
        <CardHeader>
          <CardTitle>월간 통계</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-600">월간 조회수</h3>
              <p className="text-3xl font-bold mt-2">{webtoonStats.monthlyStats.totalViews}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-600">월간 활동량</h3>
              <p className="text-3xl font-bold mt-2">{webtoonStats.monthlyStats.totalActivity}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 상태별 분포와 인기 웹툰 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>상태별 분포</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={webtoonStats.statusDistribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {webtoonStats.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>인기 웹툰 TOP 5</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {webtoonStats.topRatedWebtoons.map((webtoon, index) => (
                <div key={webtoon.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-gray-600 mr-2">#{index + 1}</span>
                      <span className="font-medium">{webtoon.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">평점 {webtoon.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 등록된 웹툰과 활동 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>최근 등록된 웹툰</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {webtoonStats.recentWebtoons.map((webtoon, index) => (
                <div key={webtoon.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-gray-600 mr-2">#{index + 1}</span>
                      <span className="font-medium">{webtoon.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{webtoon.date}</span>
                      <span className="text-sm text-gray-500">{webtoon.genre}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>활동 통계</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {webtoonStats.activityStats.map((webtoon, index) => (
                <div key={webtoon.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-gray-600 mr-2">#{index + 1}</span>
                      <span className="font-medium">{webtoon.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">댓글 {webtoon.comments}</span>
                      <span className="text-sm text-gray-500">좋아요 {webtoon.likes}</span>
                      <span className="text-sm text-gray-500">조회수 {webtoon.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebtoonStats; 