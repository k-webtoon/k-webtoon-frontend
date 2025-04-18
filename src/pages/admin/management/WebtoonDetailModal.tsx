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
import { useWebtoonStore } from '@/entities/admin/store/webtoonStore';
import { WebtoonDTO } from '@/entities/admin/model/webtoon';

export const WebtoonDetailModal: FC = () => {
  const {
    selectedWebtoon,
    isModalOpen,
    closeWebtoonModal,
    updateWebtoonStatus,
    modalLoading,
  } = useWebtoonStore();

  if (!selectedWebtoon || modalLoading) return null;

  const handleTogglePublic = () => {
    if (selectedWebtoon) {
      updateWebtoonStatus(selectedWebtoon.id);
    }
  };

  const formatNumber = (num: number | undefined) => {
    return num?.toLocaleString() || '0';
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeWebtoonModal}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>웹툰 상세 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-4">
            <img
              src={selectedWebtoon.thumbnailUrl}
              alt={selectedWebtoon.titleName}
              className="w-48 h-64 object-cover rounded-lg"
            />
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-bold">{selectedWebtoon.titleName}</h3>
              <p className="text-gray-600">작가: {selectedWebtoon.author}</p>
              <p className="text-gray-600">장르: {selectedWebtoon.genre}</p>
              <div className="flex gap-2">
                {selectedWebtoon.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                )) || null}
              </div>
              <p className="text-gray-700">{selectedWebtoon.synopsis}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">조회수</p>
              <p className="text-xl font-bold">{formatNumber(selectedWebtoon.totalCount)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">즐겨찾기</p>
              <p className="text-xl font-bold">{formatNumber(selectedWebtoon.favoriteCount)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">에피소드</p>
              <p className="text-xl font-bold">{formatNumber(selectedWebtoon.collectedNumOfEpi)}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <p>생성일: {selectedWebtoon.createdAt ? new Date(selectedWebtoon.createdAt).toLocaleDateString() : '-'}</p>
              <p>수정일: {selectedWebtoon.updatedAt ? new Date(selectedWebtoon.updatedAt).toLocaleDateString() : '-'}</p>
            </div>
            <button
              className={`px-4 py-2 rounded-md ${
                selectedWebtoon.isPublic
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
              onClick={handleTogglePublic}
            >
              {selectedWebtoon.isPublic ? '비공개로 전환' : '공개로 전환'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 