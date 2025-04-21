import { Link } from "react-router-dom"
import { Badge } from "@/shared/ui/shadcn/badge"
import { WebtoonInfo, mapGenre } from "@/entities/webtoon/model/types"
import React from "react";

interface HorizontalWebtoonCardProps {
    webtoon: WebtoonInfo & {
        titleNameWithHighlight?: React.ReactNode;
        authorWithHighlight?: React.ReactNode;
    };
    similarity?: number;
}

export const HorizontalWebtoonCard = ({ webtoon, similarity }: HorizontalWebtoonCardProps) => {
    // 웹툰 정보가 없는 경우
    if (!webtoon) {
        return (
            <>
            </>
        );
    }

    // 필수 정보가 없는 경우
    if (!webtoon.id || !webtoon.titleName) {
        return (
            <div className="flex gap-6 pb-6 border-b bg-yellow-50 p-4 rounded-md">
                <p className="text-yellow-600">웹툰 정보가 불완전합니다 (ID: {webtoon.id || '알 수 없음'})</p>
            </div>
        );
    }

    const {
        id,
        titleName,
        author = '작가 미상',
        thumbnailUrl = '',
        synopsis = '',
        starScore = 0,
        rankGenreTypes = [],
        finish = false,
        age = '전체이용가',
        titleNameWithHighlight,
        authorWithHighlight
    } = webtoon;

    return (
        <div className="flex gap-6 pb-6 border-b">
            <div className="flex-shrink-0">
                <Link to={`/webtoon/${id}`}>
                    {thumbnailUrl ? (
                        <img
                            src={thumbnailUrl}
                            alt={titleName}
                            width="150"
                            height="150"
                            className="w-[150px] h-[190px] object-cover rounded-md cursor-pointer hover:brightness-90 transition-all duration-200"
                        />
                    ) : (
                        <div className="w-[150px] h-[150px] bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-500">이미지 없음</span>
                        </div>
                    )}
                </Link>
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <Link to={`/webtoon/${id}`} className="hover:underline">
                        <h3 className="text-xl font-bold">
                            {titleNameWithHighlight || titleName}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm ml-1">
                                {typeof starScore === 'number' 
                                    ? starScore.toFixed(1) 
                                    : (String(starScore || '0.0'))}
                            </span>
                        </div>

                        {similarity !== undefined && (
                            <span className="text-blue-600 ml-2 px-2 py-1 bg-blue-100 rounded-full text-xs font-medium">
                                유사도: {(similarity * 100).toFixed(1)}%
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                        <span className="inline-block w-5 h-5 bg-green-100 text-green-600 rounded-full text-xs flex items-center justify-center">
                            ✓
                        </span>
                        <span>{authorWithHighlight || author}</span>
                    </span>
                    {rankGenreTypes.length > 0 && (
                        <span>· {rankGenreTypes.map(genre => mapGenre(genre)).join(', ')}</span>
                    )}
                    <span>· {finish ? '완결' : '연재중'}</span>
                    <span>· {age}</span>
                </div>
                {synopsis && <p className="mb-3 text-gray-700 text-left">{synopsis}</p>}
                <div className="flex flex-wrap gap-2">
                    {rankGenreTypes.map((genre, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                            #{mapGenre(genre)}
                        </Badge>
                    ))}
                    {finish && (
                        <Badge variant="outline" className="bg-blue-100 hover:bg-blue-200 text-blue-700">
                            #완결
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
};