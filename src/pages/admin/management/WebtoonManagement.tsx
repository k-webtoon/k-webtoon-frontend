import { FC, useEffect, useState } from 'react';
import { Button } from '@/shared/ui/shadcn/button';
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { Search, Eye, EyeOff } from 'lucide-react';
import { Input } from "@/shared/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/shadcn/select";
import { WebtoonDetailModal } from './WebtoonDetailModal';
import { ManagementLayout } from "@/components/admin/ManagementLayout";
import { ColumnDef } from "@tanstack/react-table";
import { useWebtoonStore } from '@/entities/admin/store/webtoonStore';
import { WebtoonDTO } from '@/entities/admin/model/webtoon';

type StatusFilterType = 'all' | 'public' | 'private';

const WebtoonManagement: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');

  const {
    webtoons,
    currentPage,
    pageSize,
    totalWebtoons,
    loading,
    stats,
    fetchWebtoons,
    fetchWebtoonStats,
    updateWebtoonStatus,
    openWebtoonModal,
  } = useWebtoonStore();

  // 초기 데이터 로드
  useEffect(() => {
    fetchWebtoonStats();
    fetchWebtoons(0, pageSize, 'all', '');
  }, []);

  const handleStatusFilterChange = async (newStatus: StatusFilterType) => {
    console.log('Dashboard card clicked:', { 
      currentStatus: statusFilter, 
      newStatus,
      currentSearch: searchQuery 
    });
    
    setStatusFilter(newStatus);
    setSearchQuery(''); // 검색어 초기화
    
    try {
      // 상태에 따라 다른 API를 호출
      await fetchWebtoons(0, pageSize, newStatus, '');
      
      console.log('Data fetched after status change:', {
        status: newStatus,
        webtoonsCount: webtoons.length
      });
    } catch (error) {
      console.error('Error fetching webtoons:', error);
    }
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch);
    // 현재 상태에 따라 검색
    fetchWebtoons(0, pageSize, statusFilter, newSearch);
  };

  const handleFilterChange = (newFilter: { status: string; search: string }) => {
    if (newFilter.status !== statusFilter) {
      handleStatusFilterChange(newFilter.status as StatusFilterType);
    }
    if (newFilter.search !== searchQuery) {
      handleSearchChange(newFilter.search);
    }
  };

  // 페이지네이션 처리
  const handlePageChange = (page: number) => {
    fetchWebtoons(page - 1, pageSize, statusFilter, searchQuery);
  };

  const dashboardCards = [
    {
      title: "총 웹툰",
      value: stats.totalWebtoons,
      onClick: () => handleStatusFilterChange('all'),
      isActive: statusFilter === 'all',
      className: `cursor-pointer transition-colors ${statusFilter === 'all'
          ? 'bg-blue-50 border-blue-200'
          : 'hover:bg-gray-50'
        }`,
    },
    {
      title: "공개 웹툰",
      value: stats.publicWebtoons,
      onClick: () => handleStatusFilterChange('public'),
      isActive: statusFilter === 'public',
      className: `cursor-pointer transition-colors ${statusFilter === 'public'
          ? 'bg-blue-50 border-blue-200'
          : 'hover:bg-gray-50'
        }`,
    },
    {
      title: "비공개 웹툰",
      value: stats.privateWebtoons,
      onClick: () => handleStatusFilterChange('private'),
      isActive: statusFilter === 'private',
      className: `cursor-pointer transition-colors ${statusFilter === 'private'
          ? 'bg-blue-50 border-blue-200'
          : 'hover:bg-gray-50'
        }`,
    },
  ];

  const statusOptions = [
    { value: 'all', label: "전체" },
    { value: 'public', label: "공개" },
    { value: 'private', label: "비공개" },
  ];

  const handlePublicToggle = async (webtoonId: number) => {
    try {
      await updateWebtoonStatus(webtoonId);
      // 상태 변경 후 현재 필터에 맞는 데이터 다시 로드
      await fetchWebtoons(0, pageSize, statusFilter, searchQuery);
      // 통계 업데이트
      await fetchWebtoonStats();
    } catch (error) {
      console.error('웹툰 상태 변경 실패:', error);
      alert('웹툰 상태 변경에 실패했습니다.');
    }
  };

  const handleDetailClick = (webtoon: WebtoonDTO) => {
    openWebtoonModal(webtoon.id);
  };

  const columns: ColumnDef<WebtoonDTO>[] = [
    {
      accessorKey: "titleName",
      header: "제목",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.titleName}
        </div>
      )
    },
    {
      accessorKey: "author",
      header: "작가",
      cell: ({ row }) => (
        <div>
          {row.original.author}
        </div>
      )
    },
    {
      accessorKey: "genre",
      header: "장르",
      cell: ({ row }) => (
        <div>
          {row.original.genre}
        </div>
      )
    },
    {
      accessorKey: "isPublic",
      header: "상태",
      cell: ({ row }) => {
        const isPublic = row.original.isPublic;
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${isPublic ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'
            }`}>
            {isPublic ? '공개' : '비공개'}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
            onClick={() => handleDetailClick(row.original)}
          >
            상세보기
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${row.original.isPublic
                ? 'text-white bg-red-500 hover:bg-red-600'
                : 'text-white bg-blue-500 hover:bg-blue-600'
              }`}
            onClick={() => handlePublicToggle(row.original.id)}
          >
            {row.original.isPublic ? '비공개로 전환' : '공개로 전환'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ManagementLayout
        title="웹툰 관리"
        description="웹툰을 관리하고 모니터링합니다."
        dashboardCards={dashboardCards}
        statusOptions={statusOptions}
        columns={columns}
        data={webtoons}
        filter={{
          status: statusFilter,
          search: searchQuery,
        }}
        onFilterChange={handleFilterChange}
        pagination={{
          page: currentPage + 1,
          limit: pageSize,
          total: totalWebtoons,
          onPageChange: handlePageChange,
        }}
        dashboardLayout="full"
      />
      <WebtoonDetailModal />
    </>
  );
};

export default WebtoonManagement; 