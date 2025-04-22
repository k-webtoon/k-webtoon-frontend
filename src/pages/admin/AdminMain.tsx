import { FC, useEffect, useState } from "react";
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { webtoonStatsApi } from "@/entities/admin/api/webtoonStatsApi";
import { userStatsApi } from "@/entities/admin/api/userStatsApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AdminMain: FC = () => {
  const [webtoonCount, setWebtoonCount] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [newSignupCount, setNewSignupCount] = useState<number>(0);
  const [signupData, setSignupData] = useState<
    { date: string; signups: number }[]
  >([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [webtoons, users, reviews, signups] = await Promise.all([
          webtoonStatsApi.getTotalCount(),
          userStatsApi.getTotalUserCount(),
          webtoonStatsApi.getCommentCount(),
          userStatsApi.getDailySignups(),
        ]);

        setWebtoonCount(webtoons || 0);
        setUserCount(users?.data || 0);
        setReviewCount(reviews || 0);
        setNewSignupCount(signups?.data?.length || 0);

        // 여기서는 API에서 가져온 데이터로 시각화용 데이터를 설정합니다.
        // 예시로 일간 가입자 수 데이터를 추가하는 부분입니다.
        setSignupData(
          signups?.data.map((signup) => ({
            date: signup.date, // API에서 반환된 날짜 데이터 (가정)
            signups: signup.count, // API에서 반환된 가입자 수 (가정)
          })) || []
        );
      } catch (error) {
        console.error("통계 데이터 가져오기 실패:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">통계 요약</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-600">전체 웹툰</h3>
              <p className="text-3xl font-bold mt-2">
                {webtoonCount.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-600">전체 사용자</h3>
              <p className="text-3xl font-bold mt-2">
                {userCount.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-600">전체 리뷰</h3>
              <p className="text-3xl font-bold mt-2">
                {reviewCount.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-600">신규 가입자</h3>
              <p className="text-3xl font-bold mt-2">
                {newSignupCount.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 가입자 수 추이 차트 */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-600 mb-4">
            가입자 수 추이 (최근 7일)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={signupData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="signups" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
