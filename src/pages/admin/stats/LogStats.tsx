import React, { useEffect } from "react";
import { useLogStatsStore } from "@/entities/admin/api/logStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface WebtoonViewCountResponse {
  id?: number;
  titleName?: string;
  author?: string;
  thumbnailUrl?: string;
}

const LogStats = () => {
  const {
    dailyUsers = 0,
    weeklyUsers = 0,
    monthlyUsers = 0,
    topWebtoon = null,
    topKeywords = [],
    pageDwellTimes = [],
    loading,
    error,
    fetchLogStats,
  } = useLogStatsStore();

  useEffect(() => {
    fetchLogStats();
  }, [fetchLogStats]); // 종속성 추가

  if (loading)
    return (
      <div className="text-center p-8 text-gray-500">
        통계 데이터를 불러오는 중입니다...
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="p-6 space-y-8">
      {/* 통계 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="일간 활성 사용자" value={dailyUsers} />
        <StatCard title="주간 활성 사용자" value={weeklyUsers} />
        <StatCard title="월간 활성 사용자" value={monthlyUsers} />
        <WebtoonCard webtoon={topWebtoon} />
      </div>

      {/* 검색 키워드 차트 */}
      <ChartSection title="TOP 10 검색 키워드">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topKeywords ?? []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="keyword" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* 페이지 체류 시간 차트 */}
      <ChartSection title="페이지별 평균 체류 시간 (초)">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pageDwellTimes ?? []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="page" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avgDurationSeconds" fill="#10b981" maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </ChartSection>
    </div>
  );
};

// 서브 컴포넌트들
const StatCard = ({ title, value }: { title: string; value?: number }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className="text-2xl font-bold mt-2">{(value ?? 0).toLocaleString()}</p>
  </div>
);

const WebtoonCard = ({
  webtoon,
}: {
  webtoon?: WebtoonViewCountResponse | null;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col items-center">
    <h3 className="text-gray-500 text-sm mb-2">최다 조회 웹툰</h3>
    {webtoon?.thumbnailUrl ? (
      <>
        <img
          src={webtoon.thumbnailUrl}
          alt={webtoon.titleName || "웹툰 썸네일"}
          className="w-16 h-16 rounded object-cover mb-2"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/default-webtoon.png";
          }}
        />
        <p className="font-semibold">{webtoon.titleName || "제목 없음"}</p>
        <p className="text-sm text-gray-500">
          {webtoon.author || "작가 정보 없음"}
        </p>
      </>
    ) : (
      <div className="text-gray-400 text-center">
        <p className="mb-2">⚠️</p>
        <p className="text-sm">데이터를 불러올 수 없습니다</p>
      </div>
    )}
  </div>
);

const ChartSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

export default LogStats;
