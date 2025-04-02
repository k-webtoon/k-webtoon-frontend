import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWebtoonDetailStore } from '@/entities/webtoondetail/model/store';
import { getWebtoonDetail, commentApi } from '@/app/api/webtoonDetailApi';
import { CommentRequest } from '@/entities/webtoondetail/model/types.ts';

function WebtoonDetail() {
    const { id } = useParams<{ id: string }>();
    const [newComment, setNewComment] = useState('');
    const { 
        webtoon, 
        comments, 
        currentPage,
        totalPages,
        setWebtoon, 
        setComments, 
        setCurrentPage,
        setTotalPages,
        addComment, 
        removeComment,
        updateComment: updateCommentInStore
    } = useWebtoonDetailStore();

    // 웹툰 상세 정보 조회
    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    const webtoonData = await getWebtoonDetail(Number(id));
                    setWebtoon(webtoonData);
                } catch (error) {
                    console.error('웹툰 데이터 로딩 실패:', error);
                }
            }
        };
        fetchData();
    }, [id, setWebtoon]);

    // 댓글 목록 조회
    useEffect(() => {
        const fetchComments = async () => {
            if (id) {
                try {
                    const response = await commentApi.getComments(Number(id), currentPage);
                    setComments(response.content);
                    setTotalPages(response.totalPages);
                } catch (error) {
                    console.error('댓글 데이터 로딩 실패:', error);
                }
            }
        };
        fetchComments();
    }, [id, currentPage, setComments, setTotalPages]);

    // 댓글 작성 처리
    const handleAddComment = async () => {
        if (!id || !newComment.trim()) return;
        try {
            const requestDto = { content: newComment };
            const response = await commentApi.addComment(Number(id), requestDto);
            addComment(response);
            setNewComment('');
        } catch (error) {
            console.error('댓글 작성 실패:', error);
        }
    };

    // 댓글 수정 처리
    const handleUpdateComment = async (commentId: number, content: string) => {
        try {
            const message = await commentApi.updateComment(commentId, content);
            console.log(message);
            updateCommentInStore(commentId, content);
        } catch (error) {
            console.error('댓글 수정 실패:', error);
        }
    };

    // 댓글 삭제 처리
    const handleDeleteComment = async (commentId: number) => {
        try {
            const message = await commentApi.deleteComment(commentId);
            console.log(message);
            removeComment(commentId);
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
        }
    };

    // 페이지 변경 처리
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (!webtoon) return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    // 미디어믹스 태그 생성 및 색상 매핑
    const mediaMixTags = [];
    if (webtoon.osmuAnime) mediaMixTags.push({ type: '애니메이션', color: 'bg-gradient-to-r from-pink-50 to-pink-100 text-pink-600' });
    if (webtoon.osmuDrama) mediaMixTags.push({ type: '드라마', color: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-600' });
    if (webtoon.osmuGame) mediaMixTags.push({ type: '게임', color: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600' });
    if (webtoon.osmuMovie) mediaMixTags.push({ type: '영화', color: 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600' });

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* 네비게이션 영역과의 간격 */}
            <div className="h-16"></div>

            {/* 상단 웹툰 정보 섹션 */}
            <div className="w-full bg-white">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row gap-16">
                        {/* 썸네일 섹션 */}
                        <div className="w-full md:w-[420px] flex-shrink-0">
                            <div className="relative group">
                                {/* 썸네일 이미지 */}
                                <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-white p-1">
                                    <div className="absolute inset-0 bg-white rounded-3xl overflow-hidden">
                                        <img 
                                            src={webtoon.url} 
                                            alt={webtoon.titleName}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {/* 미디어믹스 태그 오버레이 */}
                                        <div className="absolute top-4 left-4 flex flex-wrap gap-2 p-1">
                                            {mediaMixTags.map((tag, index) => (
                                                <span 
                                                    key={index}
                                                    className={`px-4 py-2 ${tag.color} rounded-full text-sm font-medium shadow-sm backdrop-blur-sm`}
                                                >
                                                    {tag.type}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* 평점 뱃지 */}
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                                    <div className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full shadow-lg shadow-amber-200/50">
                                        <span className="text-2xl text-white">★</span>
                                        <span className="text-xl font-bold text-white">{webtoon.starScore}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 웹툰 정보 섹션 */}
                        <div className="flex-1 space-y-10 pt-8">
                            <div className="space-y-4">
                                <h1 className="text-5xl font-bold tracking-tight text-gray-900">
                                    {webtoon.titleName}
                                </h1>
                                <p className="text-2xl text-gray-600">{webtoon.author}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {webtoon.tag.map((tag, index) => (
                                    <span 
                                        key={index}
                                        className="px-5 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full text-sm font-medium hover:from-gray-100 hover:to-gray-200 transition-all duration-300 shadow-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-sm">
                                <h2 className="text-2xl font-semibold mb-6 text-gray-900">작품 소개</h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                    {webtoon.synopsis}
                                </p>
                            </div>

                            <div className="flex gap-8">
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold text-lg text-gray-700">연령</span>
                                    <span className="px-5 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-lg font-medium text-gray-700 shadow-sm">
                                        {webtoon.age}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold text-lg text-gray-700">완결</span>
                                    <span className={`px-5 py-2.5 rounded-xl text-lg font-medium shadow-sm
                                        ${webtoon.finish 
                                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600' 
                                            : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {webtoon.finish ? 'O' : 'X'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 댓글 섹션 */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="bg-white rounded-3xl shadow-sm p-8">
                    <h2 className="text-3xl font-bold mb-12 text-gray-900">댓글</h2>
                    
                    {/* 댓글 입력 */}
                    <div className="flex gap-4 mb-12">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요"
                            className="flex-1 px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg placeholder-gray-400 shadow-sm"
                        />
                        <button
                            onClick={handleAddComment}
                            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-2xl hover:from-indigo-600 hover:to-indigo-700 transition-all font-medium text-lg shadow-lg shadow-indigo-200/50"
                        >
                            작성
                        </button>
                    </div>

                    {/* 댓글 목록 - 그리드 레이아웃 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {comments.map(comment => (
                            <div key={comment.id} className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl transition-all duration-300 hover:shadow-md">
                                <div className="flex justify-between mb-4">
                                    <span className="font-semibold text-gray-900">{comment.userNickname}</span>
                                    <span className="text-gray-500 text-sm">{comment.createdDate}</span>
                                </div>
                                <p className="text-gray-600 mb-6 line-clamp-3">{comment.content}</p>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleUpdateComment(comment.id, comment.content)}
                                            className="text-indigo-500 hover:text-indigo-600 text-sm font-medium"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="text-rose-500 hover:text-rose-600 text-sm font-medium"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-rose-500 text-lg">♥</span>
                                        <span className="text-gray-600 font-medium">{comment.likeCount}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-3 mt-16">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i)}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 
                                        ${currentPage === i
                                            ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-200/50'
                                            : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 hover:from-gray-100 hover:to-gray-200'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default WebtoonDetail;