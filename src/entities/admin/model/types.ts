import { Webtoon } from '@/entities/webtoon/model/types';
import { User } from '@/entities/user/model/types';

// 어드민 사용자
export interface AdminUser extends User {
    role: 'super' | 'admin' | 'editor';
    permissions: string[];
}

// 웹툰 관리
export interface WebtoonManagement {
    webtoon: Webtoon;
    status: 'pending' | 'approved' | 'rejected';
    lastModified: string;
    modifiedBy: string;
}

// 사용자 관리
export interface UserManagement {
    user: User;
    status: 'active' | 'suspended' | 'banned';
    lastLogin: string;
    reportCount: number;
}

// 통계 데이터
export interface Statistics {
    totalUsers: number;
    totalWebtoons: number;
    activeUsers: number;
    dailyViews: number;
    revenue: number;
    period: {
        start: string;
        end: string;
    };
}

// 시각화 데이터
export interface VisualizationData {
    type: 'line' | 'bar' | 'pie';
    title: string;
    data: {
        labels: string[];
        values: number[];
    };
    period: {
        start: string;
        end: string;
    };
}

// 추천 설정
export interface RecommendationSettings {
    algorithm: 'popular' | 'personalized' | 'hybrid';
    weight: {
        views: number;
        likes: number;
        favorites: number;
        ratings: number;
    };
    updateFrequency: 'daily' | 'weekly' | 'monthly';
}