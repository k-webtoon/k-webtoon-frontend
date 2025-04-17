import { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/shadcn/dialog";
import { Button } from "@/shared/ui/shadcn/button";
import { format } from "date-fns";

interface Webtoon {
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

interface WebtoonDetailModalProps {
  webtoon: Webtoon | null;
  isOpen: boolean;
  onClose: () => void;
  onTogglePublic: (webtoonId: number) => void;
}

export const WebtoonDetailModal: FC<WebtoonDetailModalProps> = ({
  webtoon,
  isOpen,
  onClose,
  onTogglePublic,
}) => {
  if (!webtoon) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{webtoon.title}</DialogTitle>
          <DialogDescription>
            웹툰 상세 정보 및 통계
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={webtoon.thumbnail}
              alt={webtoon.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">작가</h3>
              <p>{webtoon.author}</p>
            </div>
            <div>
              <h3 className="font-semibold">장르</h3>
              <p>{webtoon.genre}</p>
            </div>
            <div>
              <h3 className="font-semibold">설명</h3>
              <p className="text-gray-600">{webtoon.description}</p>
            </div>
            <div>
              <h3 className="font-semibold">태그</h3>
              <div className="flex flex-wrap gap-2">
                {webtoon.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold">통계</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">조회수</p>
                  <p>{webtoon.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">좋아요</p>
                  <p>{webtoon.likes.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">즐겨찾기</p>
                  <p>{webtoon.favorites.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">등록 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">등록일</p>
                  <p>{format(new Date(webtoon.createdAt), "yyyy-MM-dd")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">최근 수정일</p>
                  <p>{format(new Date(webtoon.updatedAt), "yyyy-MM-dd")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between gap-2">
          <div className="flex gap-2">
            <Button
              variant={webtoon.isPublic ? "destructive" : "default"}
              onClick={() => onTogglePublic(webtoon.id)}
            >
              {webtoon.isPublic ? "비공개로 전환" : "공개로 전환"}
            </Button>
          </div>
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 