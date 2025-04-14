import { FC, useEffect, useState } from 'react';
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { statsApi } from '@/entities/admin/api/stats';
import { CommentStatsResponse, DateRange } from '@/entities/admin/api/stats/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface CommentStatsProps {
  dateRange: DateRange;
}

const CommentStats: FC<CommentStatsProps> = ({ dateRange }) => {
  const [commentStats, setCommentStats] = useState<CommentStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommentStats = async () => {
      try {
        const response = await statsApi.getCommentStats({
          ...dateRange,
          type: 'comments'
        });
        setCommentStats(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || '댓글 통계를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommentStats();
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
  
  if (!commentStats) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg">데이터가 없습니다.</div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">전체 댓글</h3>
            <p className="text-3xl font-bold mt-2">{commentStats.summary.totalComments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">일평균 댓글</h3>
            <p className="text-3xl font-bold mt-2">{commentStats.summary.dailyAverage}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">평균 댓글 길이</h3>
            <p className="text-3xl font-bold mt-2">{commentStats.summary.averageLength}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6">일별 댓글 수</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={commentStats.dailyComments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="comments" stroke="#8884d8" name="댓글 수" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6">시간대별 댓글 분포</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commentStats.hourlyDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" name="댓글 수" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6">댓글 많은 웹툰 TOP 5</h2>
          <div className="space-y-4">
            {commentStats.topWebtoonsByComments.map((webtoon, index) => (
              <div key={webtoon.name} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-gray-600 mr-2">#{index + 1}</span>
                    <span className="font-medium">{webtoon.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">댓글 {webtoon.comments}</span>
                    <span className="text-sm text-gray-500">평균 길이 {webtoon.avgLength}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentStats; 