import { create } from "zustand";
import {
  getUserInfo,
  getUserComments,
  getLikedWebtoons,
  getFollowees,
  getFollowers,
  followUser,
  unfollowUser,
  userApi,
} from "@/app/api/userApi.ts";
import {
  UserInfo,
  UserComment,
  LikedWebtoon,
  FollowUser,
} from "@/entities/user/model/types.ts";
import { LoginDTO } from "@/entities/auth/model/types.ts";

// 토큰 검증 함수
const validateStoredToken = (): string | null => {
  const token = localStorage.getItem('token');
  return token;
};

// 인증 상태 초기화 함수
const initializeAuthState = () => {
  const token = validateStoredToken();
  return {
    token: token,
    isAuthenticated: !!token, // 토큰이 있으면 true, 없으면 false
  };
};

interface UserState {
  // 인증 관련 상태
  token: string | null;
  isAuthenticated: boolean;

  // 사용자 관련 상태
  userInfo: UserInfo | null;
  comments: UserComment[];
  likedWebtoons: LikedWebtoon[];
  followers: FollowUser[];
  followees: FollowUser[];
  loading: boolean;
  error: string | null;

  // 인증 관련 액션
  login: (userEmail: string, userPassword: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => void;

  // 사용자 관련 액션
  fetchUserInfo: (userId: number) => Promise<void>;
  fetchUserComments: (userId: number) => Promise<void>;
  fetchLikedWebtoons: (userId: number) => Promise<void>;
  fetchFollowers: (userId: number) => Promise<void>;
  fetchFollowees: (userId: number) => Promise<void>;
  followUserAction: (followerId: number, followeeId: number) => Promise<void>;
  unfollowUserAction: (followerId: number, followeeId: number) => Promise<void>;
  resetUserData: () => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // 초기 상태 (인증 + 사용자)
  ...initializeAuthState(),
  userInfo: null,
  isAuthenticated: false,
  comments: [],
  likedWebtoons: [],
  followers: [],
  followees: [],
  loading: false,
  error: null,

  // 인증 관련 액션
  /**
   * 사용자 로그인을 처리합니다.
   */
  login: async (userEmail: string, userPassword: string) => {
    set({ loading: true, error: null });
    try {
      const loginData: LoginDTO = { userEmail, userPassword };
      const token = await userApi.login(loginData);
      // 토큰 존재 확인
      if (!token) {
        throw new Error('로그인에 실패했습니다: 토큰이 없습니다.');
      }
      // 토큰 저장
      localStorage.setItem('token', token);
      // 디버깅 정보
      console.log("로그인 성공, 토큰:", token);
      // 상태 업데이트
      set({ token, isAuthenticated: true, loading: false });
      // 업데이트된 상태 확인
      const updatedState = get();
      console.log("로그인 후 상태:", updatedState);
      return;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.';
      console.error('로그인 오류:', error);
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  /**
   * 현재 토큰의 유효성을 검증합니다.
   */
  checkAuth: async () => {
    // 로딩 상태 설정
    set({ loading: true });
    // 로컬 스토리지에서 토큰 확인
    const storedToken = localStorage.getItem('token');
    console.log("인증 확인 시작:", { storedToken });
    // 토큰이 없으면 인증 상태 false로 설정하고 종료
    if (!storedToken) {
      console.log("토큰 없음, 인증 상태 false로 설정");
      set({ token: null, isAuthenticated: false, loading: false });
      return;
    }
    try {
      // 서버에 토큰 유효성 검증 요청
      const isValid = await userApi.validateToken(storedToken);
      console.log("토큰 검증 결과:", isValid);
      if (isValid) {
        // 토큰이 유효하면 인증 상태 true로 설정
        set({ token: storedToken, isAuthenticated: true, loading: false });
        console.log("토큰 유효함, 인증 상태 true로 설정");
      } else {
        // 토큰이 유효하지 않으면 제거하고 인증 상태 false로 설정
        localStorage.removeItem('token');
        set({ token: null, isAuthenticated: false, loading: false });
        console.log("토큰 유효하지 않음, 인증 상태 false로 설정");
      }
    } catch (error) {
      console.error("토큰 검증 중 오류:", error);
      // 오류 발생 시 로딩 상태는 해제합니다.
      set({ loading: false });
    }
  },

  /**
   * 로그아웃을 처리합니다.
   */
  logout: () => {
    // 토큰 제거
    localStorage.removeItem('token');
    // 상태 초기화
    set({
      token: null,
      isAuthenticated: false,
      userInfo: null,
      comments: [],
      likedWebtoons: [],
      followers: [],
      followees: [],
      error: null,
    });
    console.log("로그아웃 완료");
  },

  // 사용자 관련 액션
  /**
   * 사용자 정보를 가져옵니다.
   */
  fetchUserInfo: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const info = await getUserInfo(userId);
      set({ userInfo: info, loading: false });
    } catch (error) {
      console.error("사용자 정보 로딩 오류:", error);
      set({
        error: "사용자 정보를 불러오는 중 오류가 발생했습니다.",
        loading: false,
      });
    }
  },

  /**
   * 사용자 댓글을 가져옵니다.
   */
  fetchUserComments: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const comments = await getUserComments(userId);
      set({ comments, loading: false });
    } catch (error) {
      console.error("댓글 로딩 오류:", error);
      set({ error: "댓글을 불러오는 중 오류가 발생했습니다.", loading: false });
    }
  },

  /**
   * 좋아요한 웹툰을 가져옵니다.
   */
  fetchLikedWebtoons: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const webtoons = await getLikedWebtoons(userId);
      set({ likedWebtoons: webtoons, loading: false });
    } catch (error) {
      console.error("좋아요한 웹툰 로딩 오류:", error);
      set({
        error: "좋아요한 웹툰을 불러오는 중 오류가 발생했습니다.",
        loading: false,
      });
    }
  },

  /**
   * 팔로워를 가져옵니다.
   */
  fetchFollowers: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const followers = await getFollowers(userId);
      set({ followers, loading: false });
    } catch (error) {
      console.error("팔로워 로딩 오류:", error);
      set({
        error: "팔로워를 불러오는 중 오류가 발생했습니다.",
        loading: false,
      });
    }
  },

  /**
   * 팔로잉을 가져옵니다.
   */
  fetchFollowees: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const followees = await getFollowees(userId);
      set({ followees, loading: false });
    } catch (error) {
      console.error("팔로잉 로딩 오류:", error);
      set({
        error: "팔로잉을 불러오는 중 오류가 발생했습니다.",
        loading: false,
      });
    }
  },

  /**
   * 팔로우 액션을 수행합니다.
   */
  followUserAction: async (followerId: number, followeeId: number) => {
    set({ loading: true, error: null });
    try {
      await followUser(followerId, followeeId);
      set((state) => ({
        loading: false,
        // 팔로워 목록 업데이트 (본인이 팔로우한 경우)
        followers:
            followeeId === state.userInfo?.indexId
                ? [
                  ...state.followers,
                  {
                    indexId: followerId,
                    userEmail: "", // API에서 반환되지 않으면 빈 문자열로 설정
                    nickname: "", // API에서 반환되지 않으면 빈 문자열로 설정
                  },
                ]
                : state.followers,
      }));
    } catch (error) {
      console.error("팔로우 오류:", error);
      set({ error: "팔로우 중 오류가 발생했습니다.", loading: false });
    }
  },

  /**
   * 언팔로우 액션을 수행합니다.
   */
  unfollowUserAction: async (followerId: number, followeeId: number) => {
    set({ loading: true, error: null });
    try {
      await unfollowUser(followerId, followeeId);
      set((state) => ({
        loading: false,
        // 팔로워 목록 업데이트 (본인이 언팔로우한 경우)
        followers:
            followeeId === state.userInfo?.indexId
                ? state.followers.filter(
                    (follower) => follower.indexId !== followerId
                )
                : state.followers,
      }));
    } catch (error) {
      console.error("언팔로우 오류:", error);
      set({ error: "언팔로우 중 오류가 발생했습니다.", loading: false });
    }
  },

  /**
   * 사용자 데이터를 초기화합니다.
   */
  resetUserData: () => {
    set({
      userInfo: null,
      comments: [],
      likedWebtoons: [],
      followers: [],
      followees: [],
      error: null,
    });
  },

  /**
   * 인증 상태를 설정합니다.
   */
  setAuthenticated: (isAuthenticated: boolean) => {
    set({ isAuthenticated });
  },
}));

export default useUserStore;