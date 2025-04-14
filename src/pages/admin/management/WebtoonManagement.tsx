import { FC, useState, useEffect } from 'react';
import { Button } from '@/shared/ui/shadcn/button';
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { Search } from 'lucide-react';
import { Input } from "@/shared/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/shadcn/select";
import {
  fetchWebtoons,
  updateWebtoonStatus,
  deleteWebtoon,
  createWebtoon,
  updateWebtoon,
  exportWebtoonsToExcel,
} from '@/entities/admin/api/managementApi';
import { ManagementPageProps } from '@/entities/admin/model/managementPage';
import { WebtoonResponse } from '@/entities/admin/api/types';
import { WebtoonStatus } from '@/entities/webtoon/model/webtoon';

// 웹툰 장르 정의
export const WEBTOON_GENRE = {
  ALL: 'ALL',
  ROMANCE: 'ROMANCE',
  ACTION: 'ACTION',
  COMEDY: 'COMEDY',
  DRAMA: 'DRAMA',
  FANTASY: 'FANTASY'
} as const;

// 웹툰 상태 라벨
export const webtoonStatusLabels: Record<WebtoonStatus, string> = {
  [WebtoonStatus.ACTIVE]: '연재중',
  [WebtoonStatus.INACTIVE]: '휴재/완결',
  [WebtoonStatus.DELETED]: '삭제됨',
  [WebtoonStatus.PENDING]: '승인대기',
  [WebtoonStatus.BLOCKED]: '블라인드'
};

// 웹툰 상태 색상
export const webtoonStatusColors: Record<WebtoonStatus, { bg: string; text: string }> = {
  [WebtoonStatus.ACTIVE]: { bg: 'bg-green-100', text: 'text-green-800' },
  [WebtoonStatus.INACTIVE]: { bg: 'bg-gray-100', text: 'text-gray-800' },
  [WebtoonStatus.DELETED]: { bg: 'bg-red-100', text: 'text-red-800' },
  [WebtoonStatus.PENDING]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  [WebtoonStatus.BLOCKED]: { bg: 'bg-purple-100', text: 'text-purple-800' }
};

const WebtoonManagement: FC<ManagementPageProps> = ({ title = '웹툰 관리', description }) => {
  const [webtoons, setWebtoons] = useState<WebtoonResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WebtoonStatus | null>(null);
  const [genreFilter, setGenreFilter] = useState<string>(WEBTOON_GENRE.ALL);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadWebtoons = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWebtoons({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        status: statusFilter || undefined,
        genre: genreFilter === WEBTOON_GENRE.ALL ? undefined : genreFilter
      });

      setWebtoons(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('웹툰 목록을 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWebtoons();
  }, [currentPage, searchQuery, statusFilter, genreFilter]);

  const handleStatusChange = async (webtoonId: number, newStatus: WebtoonStatus) => {
    try {
      await updateWebtoonStatus(webtoonId, { status: newStatus });
      loadWebtoons();
    } catch (error) {
      console.error('웹툰 상태 변경에 실패했습니다:', error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await exportWebtoonsToExcel({
        search: searchQuery,
        status: statusFilter || undefined,
        genre: genreFilter === WEBTOON_GENRE.ALL ? undefined : genreFilter
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `webtoons-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('엑셀 다운로드에 실패했습니다:', error);
    }
  };

  const handleDeleteWebtoon = async (webtoonId: number) => {
    if (window.confirm('정말로 이 웹툰을 삭제하시겠습니까?')) {
      try {
        await deleteWebtoon(webtoonId);
        loadWebtoons();
      } catch (error) {
        console.error('웹툰 삭제에 실패했습니다:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 메인 컨텐츠 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleExportExcel}>엑셀 다운로드</Button>
            <Button>새 웹툰 등록</Button>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="제목 또는 작가로 검색..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select 
            value={statusFilter || "ALL"} 
            onValueChange={(value) => setStatusFilter(value === "ALL" ? null : value as WebtoonStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="상태 선택">
                {statusFilter ? (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${webtoonStatusColors[statusFilter].bg} ${webtoonStatusColors[statusFilter].text}`}>
                    {webtoonStatusLabels[statusFilter]}
                  </span>
                ) : (
                  "전체"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">전체</SelectItem>
              {Object.values(WebtoonStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${webtoonStatusColors[status].bg} ${webtoonStatusColors[status].text}`}>
                    {webtoonStatusLabels[status]}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger>
              <SelectValue placeholder="장르 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={WEBTOON_GENRE.ALL}>전체</SelectItem>
              <SelectItem value={WEBTOON_GENRE.ROMANCE}>로맨스</SelectItem>
              <SelectItem value={WEBTOON_GENRE.ACTION}>액션</SelectItem>
              <SelectItem value={WEBTOON_GENRE.COMEDY}>코미디</SelectItem>
              <SelectItem value={WEBTOON_GENRE.DRAMA}>드라마</SelectItem>
              <SelectItem value={WEBTOON_GENRE.FANTASY}>판타지</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 웹툰 목록 */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작가
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  장르
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    로딩 중...
                  </td>
                </tr>
              ) : webtoons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    웹툰이 없습니다.
                  </td>
                </tr>
              ) : (
                webtoons.map((webtoon) => (
                  <tr key={webtoon.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{webtoon.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{webtoon.titleName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{webtoon.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{webtoon.genre.join(', ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Select
                        value={webtoon.finish ? WebtoonStatus.INACTIVE : WebtoonStatus.ACTIVE}
                        onValueChange={(value) => handleStatusChange(webtoon.id, value as WebtoonStatus)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${webtoonStatusColors[webtoon.finish ? WebtoonStatus.INACTIVE : WebtoonStatus.ACTIVE].bg} ${webtoonStatusColors[webtoon.finish ? WebtoonStatus.INACTIVE : WebtoonStatus.ACTIVE].text}`}>
                              {webtoonStatusLabels[webtoon.finish ? WebtoonStatus.INACTIVE : WebtoonStatus.ACTIVE]}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(WebtoonStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${webtoonStatusColors[status].bg} ${webtoonStatusColors[status].text}`}>
                                {webtoonStatusLabels[status]}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="outline" size="sm" className="mr-2">
                        수정
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteWebtoon(webtoon.id)}
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="mt-4 flex justify-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              이전
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebtoonManagement; 