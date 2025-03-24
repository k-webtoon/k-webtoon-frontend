export interface Webtoon {
    id: number;
    titleName: string; // 또는 titleName
    author: string;
    thumbnailUrl: string; // 또는 image
    genre?: string;
    rating?: number;
    description?: string;
    isNew?: boolean;
    isTrending?: boolean;
}