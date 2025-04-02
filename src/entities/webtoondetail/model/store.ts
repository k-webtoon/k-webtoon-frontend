import { create } from "zustand";
import { WebtoonDetailState, Comment } from "./types.ts";

export const useWebtoonDetailStore = create<WebtoonDetailState>((set) => ({
    webtoon: null,
    comments: [],
    currentPage: 0,
    totalPages: 0,
    setWebtoon: (webtoon) => set({ webtoon }),
    setComments: (comments) => set({ comments }),
    setCurrentPage: (page) => set({ currentPage: page }),
    setTotalPages: (total) => set({ totalPages: total }),
    addComment: (comment) => set((state) => ({
        comments: [comment, ...state.comments]
    })),
    removeComment: (commentId: number) => set((state) => ({
        comments: state.comments.filter(comment => comment.id !== commentId)
    })),
    updateComment: (commentId: number, content: string) => set((state) => ({
        comments: state.comments.map(comment =>
            comment.id === commentId
                ? { ...comment, content }
                : comment
        )
    })),
    updateCommentLike: (commentId: number, isLiked: boolean) => set((state) => ({
        comments: state.comments.map(comment =>
            comment.id === commentId
                ? {
                    ...comment,
                    isLiked: !isLiked,
                    likeCount: isLiked ? comment.likeCount - 1 : comment.likeCount + 1
                }
                : comment
        )
    }))
})); 