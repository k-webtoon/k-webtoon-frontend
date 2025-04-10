import { FC } from 'react';
import { Card, CardContent } from "@/shared/ui/shadcn/card";
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
} from 'recharts';

const WebtoonStats: FC = () => {
  // 더미 데이터 - 장르별 웹툰 수
  const genreData = [
    { name: '로맨스', count: 45 },
    { name: '액션', count: 35 },
    { name: '판타지', count: 30 },
    { name: '일상', count: 25 },
    { name: '스릴러', count: 20 },
    { name: '개그', count: 15 },
  ];

  // 더미 데이터 - 월간 조회수 상위 웹툰
  const viewsData = [
    { name: '연애혁명', views: 1200000 },
    { name: '화산귀환', views: 980000 },
    { name: '독립일기', views: 850000 },
    { name: '여신강림', views: 820000 },
    { name: '전지적 독자 시점', views: 780000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6">장르별 웹툰 분포</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {genreData.map((entry, index) => (
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
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6">월간 조회수 상위 웹툰</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" name="조회수" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">전체 웹툰 수</h3>
            <p className="text-3xl font-bold mt-2">170</p>
            <p className="text-sm text-green-600 mt-2">▲ 15 이번 달</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">월간 총 조회수</h3>
            <p className="text-3xl font-bold mt-2">5.2M</p>
            <p className="text-sm text-green-600 mt-2">▲ 12% 전월 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-600">평균 별점</h3>
            <p className="text-3xl font-bold mt-2">4.5</p>
            <p className="text-sm text-green-600 mt-2">▲ 0.2 전월 대비</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebtoonStats; 