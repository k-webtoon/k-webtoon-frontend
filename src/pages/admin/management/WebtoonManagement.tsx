import { FC, useState, useMemo } from 'react';
import { ManagementLayout } from '@/components/admin/ManagementLayout';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  WebtoonStatus,
  WebtoonStatusEnum,
  webtoonStatusColors,
  webtoonStatusLabels,
  Webtoon
} from '@/entities/admin/model/types';

const WebtoonManagement: FC = () => {
  const [filter, setFilter] = useState({
    status: '',
    search: '',
  });

  // 더미 데이터 생성
  const data: Webtoon[] = useMemo(() => {
    const genres = ['로맨스', '액션', '판타지', '일상', '스릴러', '개그'];
    const authors = ['김작가', '이작가', '박작가', '최작가', '정작가'];
    const statuses = Object.values(WebtoonStatusEnum);
    
    return Array.from({ length: 35 }, (_, i) => ({
      id: i + 1,
      title: `웹툰 ${i + 1}${i % 3 === 0 ? ' [신작]' : i % 3 === 1 ? ' [인기]' : ''}`,
      author: authors[i % authors.length],
      description: `웹툰 ${i + 1}의 상세 설명입니다.`,
      status: statuses[i % statuses.length],
      genre: genres[i % genres.length],
      views: Math.floor(Math.random() * 1000000),
      rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 ~ 5.0
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      createdAt: new Date(2024, 0, 1 + i),
    }));
  }, []);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return data.filter(webtoon => {
      if (filter.status && webtoon.status !== filter.status) return false;
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return webtoon.title.toLowerCase().includes(searchLower) ||
               webtoon.author.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }, [data, filter]);

  // 통계 데이터
  const stats = useMemo(() => {
    const total = data.length;
    const active = data.filter(w => w.status === 'active').length;
    const inactive = data.filter(w => w.status === 'inactive').length;
    const pending = data.filter(w => w.status === 'pending').length;
    const blocked = data.filter(w => w.status === 'blocked').length;
    const deleted = data.filter(w => w.status === 'deleted').length;
    
    return { total, active, inactive, pending, blocked, deleted };
  }, [data]);

  const dashboardCards = [
    { 
      title: '전체 웹툰', 
      value: stats.total,
      onClick: () => setFilter(prev => ({ ...prev, status: '' }))
    },
    { 
      title: '연재중', 
      value: stats.active,
      onClick: () => setFilter(prev => ({ ...prev, status: WebtoonStatusEnum.ACTIVE }))
    },
    { 
      title: '완결/숨김', 
      value: stats.inactive,
      onClick: () => setFilter(prev => ({ ...prev, status: WebtoonStatusEnum.INACTIVE }))
    },
    { 
      title: '승인대기', 
      value: stats.pending,
      onClick: () => setFilter(prev => ({ ...prev, status: WebtoonStatusEnum.PENDING }))
    },
  ];

  const statusOptions = Object.values(WebtoonStatusEnum).map(status => ({
    value: status,
    label: webtoonStatusLabels[status],
  }));

  const columns: ColumnDef<Webtoon>[] = [
    {
      accessorKey: 'title',
      header: '제목',
    },
    {
      accessorKey: 'author',
      header: '작가',
    },
    {
      accessorKey: 'genre',
      header: '장르',
    },
    {
      accessorKey: 'status',
      header: '상태',
      cell: ({ row }) => {
        const status = row.original.status;
        const { bg, text } = webtoonStatusColors[status];
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
            {webtoonStatusLabels[status]}
          </span>
        );
      },
    },
    {
      accessorKey: 'views',
      header: '조회수',
      cell: ({ row }) => row.original.views.toLocaleString(),
    },
    {
      accessorKey: 'rating',
      header: '평점',
      cell: ({ row }) => `⭐ ${row.original.rating}`,
    },
    {
      accessorKey: 'lastUpdated',
      header: '최근 업데이트',
      cell: ({ row }) => format(row.original.lastUpdated, 'yyyy-MM-dd'),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
              상세보기
            </button>
            {status === 'pending' && (
              <button className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600">
                승인하기
              </button>
            )}
            {status !== 'blocked' && status !== 'deleted' && (
              <button className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600">
                {status === 'pending' ? '반려' : '블라인드'}
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <ManagementLayout
      title="웹툰 관리"
      description="웹툰 콘텐츠를 관리하고 모니터링합니다."
      dashboardCards={dashboardCards}
      statusOptions={statusOptions}
      columns={columns}
      data={filteredData}
      filter={filter}
      onFilterChange={setFilter}
      pagination={{
        page: 1,
        limit: 10,
        total: filteredData.length,
        onPageChange: (page) => console.log('페이지 변경:', page),
      }}
    />
  );
};

export default WebtoonManagement; 