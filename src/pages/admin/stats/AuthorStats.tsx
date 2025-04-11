import { FC, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";
import { statsApi } from '@/entities/admin/api/stats';
import { AuthorStatsResponse } from '@/entities/admin/api/stats/types';
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

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const AuthorStats: FC = () => {
  const [authorStats, setAuthorStats] = useState<AuthorStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorStats = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);

        console.log('Fetching author stats with params:', {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          type: 'authors'
        });

        const response = await statsApi.getAuthorStats({
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          type: 'authors'
        });

        console.log('API Response:', response.data);
        setAuthorStats(response.data);
      } catch (err: any) {
        console.error('Error fetching author stats:', err);
        setError(err.response?.data?.message || '작가 통계를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorStats();
  }, []);

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
  
  if (!authorStats) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg">데이터가 없습니다.</div>
    </div>
  );

  // 월별 신규 작가 데이터 변환
  const monthlyData = authorStats.monthlyNewAuthors.map(item => ({
    name: `${item.month}월`,
    authors: item.authors
  }));

  // 작품 수별 작가 분포 데이터 변환
  const worksData = authorStats.worksDistribution.map(item => ({
    name: item.works,
    value: item.count
  }));

  // 상위 작가 데이터 변환
  const topAuthorsData = authorStats.topAuthors.map(item => ({
    name: item.name,
    views: item.totalViews,
    rating: item.avgRating
  }));

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6">월별 신규 작가 등록 추이</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="authors" stroke="#8884d8" name="신규 작가 수" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6">작품 수별 작가 분포</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={worksData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" name="작가 수" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6">인기 작가 TOP 5</h2>
            <div className="space-y-4">
              {topAuthorsData.map((author, index) => (
                <div key={author.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-gray-600 mr-2">#{index + 1}</span>
                      <span className="font-medium">{author.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">평점 {author.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    총 조회수: {author.views.toLocaleString()}
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
            <h3 className="text-lg font-medium text-gray-600">전체 작가 수</h3>
            <p className="text-3xl font-bold mt-2">{authorStats.summary.totalAuthors}</p>
            <p className="text-sm text-green-600 mt-2">▲ {authorStats.summary.averageWorksPerAuthor} 작품</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">작가당 평균 작품 수</h3>
            <p className="text-3xl font-bold mt-2">{authorStats.summary.averageWorksPerAuthor}</p>
            <p className="text-sm text-green-600 mt-2">▲ 전월 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">평균 작품 평점</h3>
            <p className="text-3xl font-bold mt-2">{authorStats.summary.averageRating}</p>
            <p className="text-sm text-green-600 mt-2">▲ 전월 대비</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthorStats; 