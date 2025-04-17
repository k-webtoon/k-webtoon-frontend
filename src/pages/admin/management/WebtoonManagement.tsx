import { FC, useState } from 'react';
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

interface WebtoonDTO {
  id: number;
  title: string;
  author: string;
  genre: string;
  isPublic: boolean;
  thumbnail: string;
  description: string;
  tags: string[];
  views: number;
  likes: number;
  favorites: number;
  createdAt: string;
  updatedAt: string;
}

const WebtoonManagement: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [selectedWebtoon, setSelectedWebtoon] = useState<WebtoonDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 더미 데이터
  const webtoons: WebtoonDTO[] = [
    { 
      id: 1, 
      title: '신의 탑', 
      author: 'SIU', 
      genre: 'action', 
      isPublic: true, 
      thumbnail: '/images/webtoon-placeholder.jpg',
      description: '자신의 모든 것이었던 소녀를 쫓아 탑에 들어온 소년과 그를 시험하는 자들의 이야기',
      tags: ['판타지', '액션', '모험'],
      views: 1000000,
      likes: 50000,
      favorites: 30000,
      createdAt: '2024-01-01',
      updatedAt: '2024-03-15'
    },
    { 
      id: 2, 
      title: '여신강림', 
      author: '야옹이', 
      genre: 'romance', 
      isPublic: true, 
      thumbnail: '/images/webtoon-placeholder.jpg',
      description: '평범한 여고생이 화장으로 여신이 되기까지의 과정을 담은 스토리',
      tags: ['로맨스', '학원', '드라마'],
      views: 800000,
      likes: 40000,
      favorites: 25000,
      createdAt: '2024-01-15',
      updatedAt: '2024-03-10'
    },
    { 
      id: 3, 
      title: '전지적 독자 시점', 
      author: '슬리피-C', 
      genre: 'action', 
      isPublic: false, 
      thumbnail: '/images/webtoon-placeholder.jpg',
      description: '소설의 결말을 알고 있는 유일한 독자가 세계의 종말을 막기 위해 나서는 이야기',
      tags: ['판타지', '액션', 'SF'],
      views: 900000,
      likes: 45000,
      favorites: 28000,
      createdAt: '2024-02-01',
      updatedAt: '2024-03-20'
    },
  ];

  // 필터링된 웹툰 목록
  const filteredWebtoons = webtoons.filter(webtoon => {
    const matchesSearch = !searchQuery || 
                         webtoon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         webtoon.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || statusFilter === 'all' || 
                         (statusFilter === 'public' && webtoon.isPublic) ||
                         (statusFilter === 'private' && !webtoon.isPublic);
    return matchesSearch && matchesStatus;
  });

  // 상태별 웹툰 수 계산
  const webtoonStats = {
    total: webtoons.length,
    public: webtoons.filter(webtoon => webtoon.isPublic).length,
    private: webtoons.filter(webtoon => !webtoon.isPublic).length,
  };

  const handlePublicToggle = (webtoonId: number) => {
    // 실제 구현에서는 API 호출 등을 통해 처리
    console.log('공개 상태 토글:', webtoonId);
  };

  const handleDetailClick = (webtoon: WebtoonDTO) => {
    setSelectedWebtoon(webtoon);
    setIsModalOpen(true);
  };

  const dashboardCards = [
    {
      title: "총 웹툰",
      value: webtoonStats.total,
      onClick: () => setStatusFilter('all'),
    },
    {
      title: "공개 웹툰",
      value: webtoonStats.public,
      onClick: () => setStatusFilter('public'),
    },
    {
      title: "비공개 웹툰",
      value: webtoonStats.private,
      onClick: () => setStatusFilter('private'),
    },
  ];

  const statusOptions = [
    { value: "all", label: "전체" },
    { value: "public", label: "공개" },
    { value: "private", label: "비공개" },
  ];

  const columns: ColumnDef<WebtoonDTO>[] = [
    { accessorKey: "title", header: "제목" },
    { accessorKey: "author", header: "작가" },
    { accessorKey: "genre", header: "장르" },
    {
      accessorKey: "isPublic",
      header: "상태",
      cell: ({ row }) => {
        const isPublic = row.original.isPublic;
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${
            isPublic ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'
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
            className={`px-3 py-1 text-sm rounded-md ${
              row.original.isPublic
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
        data={filteredWebtoons}
        filter={{
          status: statusFilter || '',
          search: searchQuery,
        }}
        onFilterChange={(newFilter) => {
          setStatusFilter(newFilter.status || undefined);
          setSearchQuery(newFilter.search);
        }}
        pagination={{
          page: 1,
          limit: 10,
          total: filteredWebtoons.length,
          onPageChange: () => {},
        }}
        dashboardLayout="full"
      />
      <WebtoonDetailModal
        webtoon={selectedWebtoon}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTogglePublic={handlePublicToggle}
      />
    </>
  );
};

export default WebtoonManagement; 