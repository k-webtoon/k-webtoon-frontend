import { create } from "zustand";
import { WebtoonDetail, Comment } from "../types";

interface WebtoonDetailState {
  webtoon: WebtoonDetail | null;
  comments: Comment[];
  bestComments: Comment[]; // 베스트 댓글 상태 추가
  currentPage: number;
  totalPages: number;
  setWebtoon: (webtoon: WebtoonDetail) => void;
  setComments: (comments: Comment[]) => void;
  setBestComments: (bestComments: Comment[]) => void; // 베스트 댓글 액션 추가
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  addComment: (comment: Comment) => void;
  removeComment: (commentId: number) => void;
  updateComment: (commentId: number, content: string) => void;
  updateCommentLike: (commentId: number, isLiked: boolean) => void;
}

export const useWebtoonDetailStore = create<WebtoonDetailState>((set) => ({
  webtoon: null,
  comments: [],
  bestComments: [], // 초기 상태 추가
  currentPage: 0,
  totalPages: 0,
  setWebtoon: (webtoon) => set({ webtoon }),
  setComments: (comments) => set({ comments }),
  setBestComments: (bestComments) => set({ bestComments }), // 베스트 댓글 설정 액션
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (total) => set({ totalPages: total }),
  addComment: (comment) =>
    set((state) => ({
      comments: [comment, ...state.comments],
    })),
  removeComment: (commentId: number) =>
    set((state) => ({
      comments: state.comments.filter((comment) => comment.id !== commentId),
    })),
  updateComment: (commentId: number, content: string) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === commentId ? { ...comment, content } : comment
      ),
    })),
  updateCommentLike: (commentId: number, isLiked: boolean) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !isLiked,
              likeCount: isLiked
                ? comment.likeCount - 1
                : comment.likeCount + 1,
            }
          : comment
      ),
    })),
}));
