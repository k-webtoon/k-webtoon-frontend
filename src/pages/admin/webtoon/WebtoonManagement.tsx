import { FC, useState } from 'react';
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

const WebtoonManagement: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  // 더미 데이터
  const webtoons = [
    { id: 1, title: '신의 탑', author: 'SIU', genre: 'action', status: 'ongoing', thumbnail: '/images/webtoon-placeholder.jpg' },
    { id: 2, title: '여신강림', author: '야옹이', genre: 'romance', status: 'ongoing', thumbnail: '/images/webtoon-placeholder.jpg' },
    { id: 3, title: '전지적 독자 시점', author: '슬리피-C', genre: 'action', status: 'completed', thumbnail: '/images/webtoon-placeholder.jpg' },
  ];

  // 필터링된 웹툰 목록
  const filteredWebtoons = webtoons.filter(webtoon => {
    const matchesSearch = webtoon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         webtoon.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !genreFilter || webtoon.genre === genreFilter;
    const matchesStatus = !statusFilter || webtoon.status === statusFilter;
    return matchesSearch && matchesGenre && matchesStatus;
  });

  // 상태별 웹툰 수 계산
  const webtoonStats = {
    total: webtoons.length,
    ongoing: webtoons.filter(webtoon => webtoon.status === 'ongoing').length,
    completed: webtoons.filter(webtoon => webtoon.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-600">전체 웹툰</h3>
            <p className="text-2xl font-bold mt-1">{webtoonStats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-600">연재중</h3>
            <p className="text-2xl font-bold mt-1 text-green-600">{webtoonStats.ongoing}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-600">완결</h3>
            <p className="text-2xl font-bold mt-1 text-gray-600">{webtoonStats.completed}</p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">웹툰 관리</h2>
          <div className="flex gap-4">
            <Button variant="outline">엑셀 다운로드</Button>
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
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger>
              <SelectValue placeholder="장르 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="action">액션</SelectItem>
              <SelectItem value="romance">로맨스</SelectItem>
              <SelectItem value="comedy">코미디</SelectItem>
              <SelectItem value="drama">드라마</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="ongoing">연재중</SelectItem>
              <SelectItem value="completed">완결</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 웹툰 목록 */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  썸네일
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
              {filteredWebtoons.map((webtoon) => (
                <tr key={webtoon.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={webtoon.thumbnail}
                      alt={webtoon.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{webtoon.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{webtoon.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{webtoon.genre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      webtoon.status === 'ongoing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {webtoon.status === 'ongoing' ? '연재중' : '완결'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="outline" size="sm" className="mr-2">
                      수정
                    </Button>
                    <Button variant="destructive" size="sm">
                      삭제
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-2">
            <Button variant="outline" size="sm">이전</Button>
            <Button variant="outline" size="sm" className="bg-blue-50">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">다음</Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default WebtoonManagement; 