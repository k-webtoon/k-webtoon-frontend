import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/shadcn/tabs";
import UserStats from './UserStats';
import WebtoonStats from './WebtoonStats';
import CommentStats from './CommentStats';
import { DateRangePicker } from '@/shared/ui/date-range-picker';
import { DateRange } from '@/entities/admin/api/stats/types';
import { format } from 'date-fns';

interface StatsProps { }

export const Stats: FC<StatsProps> = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: format(new Date(new Date().setMonth(new Date().getMonth() - 6)), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">통계</h1>
        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
        />
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">사용자</TabsTrigger>
          <TabsTrigger value="webtoons">웹툰</TabsTrigger>
          <TabsTrigger value="comments">댓글</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserStats dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="webtoons">
          <WebtoonStats dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="comments">
          <CommentStats dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 