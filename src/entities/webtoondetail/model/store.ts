import { create } from "zustand";
import {
  WebtoonDetail,
  WebtoonComment,
  CommentWithAnalysis,
} from "@/entities/webtoondetail/model/types";

interface WebtoonDetailState {
  // 웹툰 기본 정보
  webtoon: WebtoonDetail | null;
  setWebtoon: (webtoon: WebtoonDetail) => void;

  // 댓글 관련 상태
  comments: CommentWithAnalysis[];
  bestComments: WebtoonComment[];
  currentPage: number;
  totalPages: number;

  // 액션 함수
  setComments: (comments: CommentWithAnalysis[]) => void;
  setBestComments: (bestComments: WebtoonComment[]) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;

  addComment: (comment: WebtoonComment) => void;
  updateCommentAnalysis: (
    commentId: number,
    analysis: Partial<CommentWithAnalysis>
  ) => void;
  removeComment: (commentId: number) => void;
  updateCommentLike: (commentId: number, isLiked: boolean) => void;
}

export const useWebtoonDetailStore = create<WebtoonDetailState>((set) => ({
  webtoon: null,
  comments: [],
  bestComments: [],
  currentPage: 0,
  totalPages: 0,

  setWebtoon: (webtoon) => set({ webtoon }),

  setComments: (comments) => set({ comments }),

  setBestComments: (bestComments) => set({ bestComments }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setTotalPages: (total) => set({ totalPages: total }),

  addComment: (comment) =>
    set((state) => ({
      comments: [
        {
          comment,
          feelTop3: null,
          message1: null,
          message2: null,
          message3: null,
          randomMessageIndex: null,
          isAnalyzing: true, // 초기 분석 중 상태
        },
        ...state.comments,
      ],
    })),

  updateCommentAnalysis: (commentId, analysis) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.comment.id === commentId
          ? {
              ...c,
              ...analysis,
              isAnalyzing: false,
              randomMessageIndex:
                c.randomMessageIndex ?? // 기존 값 유지 // 최초 분석 완료 시 랜덤 인덱스 생성
                ([
                  analysis.message1,
                  analysis.message2,
                  analysis.message3,
                ].filter(Boolean).length > 0
                  ? Math.floor(Math.random() * 3)
                  : null),
            }
          : c
      ),
    })),

  removeComment: (commentId) =>
    set((state) => ({
      comments: state.comments.filter((c) => c.comment.id !== commentId),
    })),

  updateCommentLike: (commentId, isLiked) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.comment.id === commentId
          ? {
              ...c,
              comment: {
                ...c.comment,
                isLiked,
                likeCount: isLiked
                  ? c.comment.likeCount + 1
                  : c.comment.likeCount - 1,
              },
            }
          : c
      ),
    })),
}));
