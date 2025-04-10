import { FC } from 'react';
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const AuthorStats: FC = () => {
  // 더미 데이터 - 월별 신규 작가 등록
  const monthlyData = [
    { name: '1월', authors: 5 },
    { name: '2월', authors: 7 },
    { name: '3월', authors: 4 },
    { name: '4월', authors: 8 },
    { name: '5월', authors: 6 },
    { name: '6월', authors: 9 },
  ];

  // 더미 데이터 - 작품 수별 작가 분포
  const worksData = [
    { works: '1작품', count: 25 },
    { works: '2작품', count: 15 },
    { works: '3작품', count: 8 },
    { works: '4작품', count: 5 },
    { works: '5작품 이상', count: 3 },
  ];

  // 더미 데이터 - 인기 작가 TOP 5
  const topAuthors = [
    { name: '김작가', totalViews: 2500000, avgRating: 4.8 },
    { name: '이작가', totalViews: 2000000, avgRating: 4.7 },
    { name: '박작가', totalViews: 1800000, avgRating: 4.6 },
    { name: '최작가', totalViews: 1500000, avgRating: 4.5 },
    { name: '정작가', totalViews: 1200000, avgRating: 4.4 },
  ];

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
                  <XAxis dataKey="works" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" name="작가 수" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6">인기 작가 TOP 5</h2>
            <div className="space-y-4">
              {topAuthors.map((author, index) => (
                <div key={author.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-gray-600 mr-2">#{index + 1}</span>
                      <span className="font-medium">{author.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">평점 {author.avgRating}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    총 조회수: {author.totalViews.toLocaleString()}
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
            <p className="text-3xl font-bold mt-2">56</p>
            <p className="text-sm text-green-600 mt-2">▲ 9 이번 달</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">작가당 평균 작품 수</h3>
            <p className="text-3xl font-bold mt-2">2.3</p>
            <p className="text-sm text-green-600 mt-2">▲ 0.2 전월 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">평균 작품 평점</h3>
            <p className="text-3xl font-bold mt-2">4.6</p>
            <p className="text-sm text-green-600 mt-2">▲ 0.1 전월 대비</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthorStats; 