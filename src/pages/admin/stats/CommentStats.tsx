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

const CommentStats: FC = () => {
  // 더미 데이터 - 일별 댓글 수
  const dailyData = [
    { date: '03/15', comments: 120 },
    { date: '03/16', comments: 150 },
    { date: '03/17', comments: 180 },
    { date: '03/18', comments: 140 },
    { date: '03/19', comments: 160 },
    { date: '03/20', comments: 200 },
    { date: '03/21', comments: 190 },
  ];

  // 더미 데이터 - 시간대별 댓글 분포
  const hourlyData = [
    { hour: '00-04', count: 50 },
    { hour: '04-08', count: 30 },
    { hour: '08-12', count: 120 },
    { hour: '12-16', count: 180 },
    { hour: '16-20', count: 220 },
    { hour: '20-24', count: 150 },
  ];

  // 더미 데이터 - 댓글이 많은 웹툰 TOP 5
  const topWebtoons = [
    { name: '연애혁명', comments: 1200, avgLength: 25 },
    { name: '화산귀환', comments: 980, avgLength: 22 },
    { name: '독립일기', comments: 850, avgLength: 18 },
    { name: '여신강림', comments: 820, avgLength: 20 },
    { name: '전지적 독자 시점', comments: 780, avgLength: 24 },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6">일별 댓글 추이</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6">시간대별 댓글 분포</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
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

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6">댓글이 많은 웹툰 TOP 5</h2>
            <div className="space-y-4">
              {topWebtoons.map((webtoon, index) => (
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