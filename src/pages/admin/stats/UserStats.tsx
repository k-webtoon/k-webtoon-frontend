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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const UserStats: FC = () => {
  // 더미 데이터 - 월별 사용자 증가
  const monthlyData = [
    { name: '1월', users: 400 },
    { name: '2월', users: 600 },
    { name: '3월', users: 800 },
    { name: '4월', users: 1000 },
    { name: '5월', users: 1200 },
    { name: '6월', users: 1234 },
  ];

  // 더미 데이터 - 사용자 연령대 분포
  const ageData = [
    { name: '10대', value: 200 },
    { name: '20대', value: 500 },
    { name: '30대', value: 300 },
    { name: '40대', value: 150 },
    { name: '50대 이상', value: 84 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6">월별 사용자 증가 추이</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6">연령대별 사용자 분포</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">주요 통계</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">일일 활성 사용자</p>
                <p className="text-2xl font-bold">856</p>
              </div>
              <div>
                <p className="text-gray-600">월간 활성 사용자</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <div>
                <p className="text-gray-600">평균 체류 시간</p>
                <p className="text-2xl font-bold">25분</p>
              </div>
              <div>
                <p className="text-gray-600">신규 가입률</p>
                <p className="text-2xl font-bold">+12.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserStats; 