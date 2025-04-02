import axios from 'axios';
import { WebtoonDetail, Comment, CommentRequest, CommentPageResponse } from '@/entities/webtoondetail/model/types.ts';

const BASE_URL = 'http://localhost:8080';

// 웹툰 상세 정보 API
export const getWebtoonDetail = async (id: number): Promise<WebtoonDetail> => {
    const response = await axios.get(`${BASE_URL}/api/webtoons/${id}`);
    return response.data;
};

// 댓글 관련 API
export const commentApi = {
    // 웹툰의 댓글 목록 조회 (페이지네이션)
    getComments: async (webtoonId: number, page: number = 0, size: number = 10): Promise<CommentPageResponse> => {
        const response = await axios.get(`${BASE_URL}/api/comments/${webtoonId}`, {
            params: { page, size }
        });
        return response.data;
    },

    // 댓글 작성
    addComment: async (webtoonId: number, requestDto: CommentRequest): Promise<Comment> => {
        const response = await axios.post(`${BASE_URL}/api/comments/${webtoonId}`, requestDto);
        return response.data;
    },

    // 댓글 수정
    updateComment: async (id: number, content: string): Promise<string> => {
        const response = await axios.put(`${BASE_URL}/api/comments/${id}`, content);
        return response.data;
    },

    // 댓글 삭제
    deleteComment: async (id: number): Promise<string> => {
        const response = await axios.delete(`${BASE_URL}/api/comments/${id}`);
        return response.data;
    },

    // 댓글 좋아요
    likeComment: async (id: number): Promise<string> => {
        const response = await axios.post(`${BASE_URL}/api/comments/${id}/like`);
        return response.data;
    },

    // 댓글 좋아요 취소
    unlikeComment: async (id: number): Promise<string> => {
        const response = await axios.post(`${BASE_URL}/api/comments/${id}/unlike`);
        return response.data;
    }
}; 