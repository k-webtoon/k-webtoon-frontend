// 사용자 정보 인터페이스
export interface UserInfo {
  indexId: number;
  userEmail: string;
  nickname: string;
  userAge: number;
  gender: string;
  commentCount: number;
  followerCount: number;
  followeeCount: number;
  profileImage?: string;
  bio?: string;
  followers?: FollowUser[];
  followees?: FollowUser[];
}

// 사용자 댓글 인터페이스
export interface UserComment {
  id: number;
  content: string;
  nickname: string;
  createdDate: string;
  likeCount: number;
  webtoonId: number;
  webtoonTitle: string;
  replyCount: number;
}

// 좋아요한 웹툰 인터페이스
export interface LikedWebtoon {
  id: number;
  title: string;
  thumbnailUrl: string;
}

// 팔로우 사용자 인터페이스
export interface FollowUser {
  indexId: number;
  userEmail: string;
  nickname: string;
}

// 사용자 상태 인터페이스
export interface User {
  Nickname: string;
  // 기존에 정의된 인터페이스
}
