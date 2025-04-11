import { FC, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";
import { statsApi } from '@/entities/admin/api/stats';
import { CommentStatsResponse } from '@/entities/admin/api/stats/types';
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

const CommentStats: FC = () => {
  const [commentStats, setCommentStats] = useState<CommentStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommentStats = async () => {
      try {
        const response = await statsApi.getCommentStats({
          startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
          endDate: new Date().toISOString(),
          type: 'comments'
        });
        setCommentStats(response.data);
      } catch (err) {
        setError('댓글 통계를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommentStats();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!commentStats) return <div>데이터가 없습니다.</div>;

  // 일별 댓글 수 데이터 변환
  const dailyData = commentStats.dailyComments.map(item => ({
    name: item.date,
    comments: item.comments
  }));

  // 시간대별 댓글 분포 데이터 변환
  const hourlyData = commentStats.hourlyDistribution.map(item => ({
    name: `${item.hour}시`,
    count: item.count
  }));

  // 댓글 많은 웹툰 TOP 5 데이터 변환
  const topWebtoonsData = commentStats.topWebtoonsByComments.map(item => ({
    name: item.name,
    comments: item.comments,
    avgLength: item.avgLength
  }));

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6">일별 댓글 추이</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="comments" stroke="#8884d8" name="댓글 수" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6">시간대별 댓글 분포</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" name="댓글 수" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6">댓글이 많은 웹툰 TOP 5</h2>
            <div className="space-y-4">
              {topWebtoonsData.map((webtoon, index) => (
                <div key={webtoon.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-gray-600 mr-2">#{index + 1}</span>
                      <span className="font-medium">{webtoon.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      평균 {webtoon.avgLength}자
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    총 댓글 수: {webtoon.comments.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">전체 댓글 수</h3>
            <p className="text-3xl font-bold mt-2">3,456</p>
            <p className="text-sm text-green-600 mt-2">▲ 456 이번 주</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">일평균 댓글 수</h3>
            <p className="text-3xl font-bold mt-2">163</p>
            <p className="text-sm text-green-600 mt-2">▲ 12% 전주 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">평균 댓글 길이</h3>
            <p className="text-3xl font-bold mt-2">22자</p>
            <p className="text-sm text-green-600 mt-2">▲ 2자 전월 대비</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommentStats; 