import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useUserStore } from "@/entities/user/api/userStore.ts";
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { clsx } from "clsx";
import { useUserActivityStore } from "@/entities/user/api/profileStore.ts";
import ChangePassword from "./ChangePassword";
import ProfileImageUploader from "./ProfileImageUploader";
import FollowersList from "./FollowersList";
import FolloweesList from "./FolloweesList";
import { BioSection } from "./BioSection";
import { CommentSection } from "./CommentSection";
import WebtoonSlider from "@/features/webtoon-list/ui/WebtoonSlider.tsx";
import { useWebtoonLikeStore } from "@/entities/webtoon-like/api/store.ts";
import { WebtoonInfo } from "@/entities/webtoon/model/types.ts";
import { useWebtoonStore } from "@/entities/webtoon/api/store.ts";
import {useWebtoonFavoriteStore} from "@/entities/webtoon-favorite/api/store.ts";

type TabType =
    | "overview"
    | "settings"
    | "security"
    | "privacy"
    | "followers"
    | "followees"
    | "recommendation-settings";

export const MyProfile = () => {
  const location = useLocation();
  const locationUserInfo = location.state?.userInfo;

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const {
    userInfo,
    comments,
    followers,
    followees,
    error,
    fetchMyInfo,
    fetchMyComments,
    fetchFollowers,
    fetchFollowees,
  } = useUserStore();
  const { fetchWebtoonById, resetRecommendations } = useWebtoonStore();
  const { likedWebtoons, getLikedWebtoons } = useWebtoonLikeStore();
  const { favoriteWebtoons } = useWebtoonFavoriteStore();
  const [likedWebtoonInfoList, setLikedWebtoonInfoList] = useState<WebtoonInfo[]>([]);
  const [favoriteWebtoonInfoList, setFavoriteWebtoonInfoList] = useState<WebtoonInfo[]>([]);


  useEffect(() => {
    resetRecommendations();
  }, [likedWebtoonInfoList]);

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    commentVisibility: "public",
    likeVisibility: "public",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const userId = locationUserInfo?.indexId;

    const fetchData = async () => {
      try {
        if (!userId) {
          console.warn("사용자 ID가 없습니다. location 정보 확인 필요", locationUserInfo);
          return;
        }

        await Promise.all([
          fetchMyInfo(userId),
          fetchMyComments(userId),
          fetchFollowers(userId),
          fetchFollowees(userId),
          getLikedWebtoons(userId),
        ]);
      } catch (err) {
        console.error("프로필 관련 데이터 로딩 중 에러 발생", err);
      }
    };

    fetchData();
  }, []);

  // 좋아요한 웹툰 ID 목록을 문자열로 메모이제이션
  const likedWebtoonIdsString = useMemo(() => {
    const likedWebtoonIds: number[] = [];
    likedWebtoons.forEach((isLiked, webtoonId) => {
      if (isLiked === true) {
        likedWebtoonIds.push(webtoonId);
      }
    });
    return likedWebtoonIds.sort().join(',');
  }, [likedWebtoons]);

  const favoriteWebtoonIdsString = useMemo(() => {
    const favoriteWebtoonIds: number[] = [];
    favoriteWebtoons.forEach((isFavorite, webtoonId) => {
      if (isFavorite === true) {
        favoriteWebtoonIds.push(webtoonId);
      }
    });
    return favoriteWebtoonIds.sort().join(',');
  }, [favoriteWebtoons]);
  
  // 좋아요한 웹툰 정보 가져오기
  useEffect(() => {
    const updateWebtoonData = async () => {
      const likedWebtoonIds = likedWebtoonIdsString.split(',').filter(id => id !== '').map(Number);
      const favoriteWebtoonIds = favoriteWebtoonIdsString.split(',').filter(id => id !== '').map(Number);
      if (likedWebtoonIds.length === 0) {
        setLikedWebtoonInfoList([]);
        setFavoriteWebtoonInfoList([]);
        return;
      }

      // 이미 데이터를 로드한 적이 있고, ID 목록이 같다면 다시 로드하지 않음
      if (likedWebtoonInfoList.length > 0 &&
          likedWebtoonInfoList.length === likedWebtoonIds.length &&
          likedWebtoonIds.every(id => likedWebtoonInfoList.some(info => info.id === id))) {
        return;
      }

      const fetchWebtoonData = async (webtoonId: number) => {
        try {
          await fetchWebtoonById(webtoonId);
          const currentWebtoon = useWebtoonStore.getState().currentWebtoon;
          return currentWebtoon;
        } catch (error) {
          console.error(`웹툰 ID ${webtoonId} 정보 가져오기 실패:`, error);
          return null;
        }
      };
      
      // 병렬로 웹툰 정보 요청
      const webtoonDetailsPromises = likedWebtoonIds.map(id => fetchWebtoonData(id));
      const webtoonDetailsResults = await Promise.all(webtoonDetailsPromises);

      // null이 아닌 결과만 필터링하여 상태 업데이트
      const validWebtoonDetails = webtoonDetailsResults.filter(
          (detail): detail is WebtoonInfo => detail !== null
      ).map(webtoon => {
        if(webtoon && webtoon.starScore !== undefined && webtoon.starScore !== null) {
          if(typeof webtoon.starScore !== 'number') {
            try {
              webtoon.starScore = parseFloat(webtoon.starScore as any) || 0;
            } catch(e) {
              webtoon.starScore = 0;
            }
          }
        } else {
          webtoon.starScore = 0;
        }
        return webtoon;
      });

      setLikedWebtoonInfoList(validWebtoonDetails);



    };

    updateWebtoonData();
  }, [likedWebtoonIdsString, favoriteWebtoonIdsString, likedWebtoonInfoList.length, fetchWebtoonById]);

  const { fetchUserActivity } = useUserActivityStore();

  useEffect(() => {
    const userId = locationUserInfo?.indexId;

    if (userId) {
      fetchUserActivity(userId);
    }
  }, [locationUserInfo, fetchUserActivity]);

  const handlePrivacyChange = async (setting: string, value: string) => {
    setPrivacySettings((prev) => ({ ...prev, [setting]: value }));
    // TODO: 공개 범위 설정 API 호출
    setMessage({ type: "success", text: "설정이 저장되었습니다." });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8 ">
                <h2 className="text-xl font-bold mb-4">활동 요약</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent>
                      <h3 className="text-lg font-medium">찜한 웹툰</h3>
                      <p className="text-2xl font-bold">{likedWebtoonInfoList.length}</p>
                    </CardContent>
                  </Card>
                  {/*<Card>*/}
                  {/*  <CardContent>*/}
                  {/*    <h3 className="text-lg font-medium">즐겨찾기한 웹툰</h3>*/}
                  {/*    <p className="text-2xl font-bold">{favoriteWebtoonInfoList.length}</p>*/}
                  {/*  </CardContent>*/}
                  {/*</Card>*/}
                  <Card>
                    <CardContent>
                      <h3 className="text-lg font-medium">작성한 댓글</h3>
                      <p className="text-2xl font-bold">{comments.length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <h3 className="text-lg font-medium">팔로워</h3>
                      <p className="text-2xl font-bold">{followers.length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <h3 className="text-lg font-medium">팔로잉</h3>
                      <p className="text-2xl font-bold">{followees.length}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8 ">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">좋아요한 웹툰</h2>
                </div>
                <div>
                  { showLoading ? (
                      // 빈 배열일 때
                      <div className="flex flex-col items-center justify-center h-64 mt-20 mb-20">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xl font-semibold text-gray-700">데이터를 불러오는 중입니다...</p>
                        <p className="text-gray-500 mt-2">잠시만 기다려주세요</p>
                      </div>

                  ) : likedWebtoonInfoList.length > 0 ? (
                      // 데이터 있을 때
                      <WebtoonSlider
                          title=""
                          webtoons={() => Promise.resolve(likedWebtoonInfoList)}
                          cardSize={'sm'}
                          initialLoad={false}
                      />
                  ) : (
                      // 로딩 중
                      <div className="flex flex-col items-center justify-center h-64 mt-10 mb-10">
                        <p className="text-xl font-semibold text-gray-700">좋아요한 웹툰이 없습니다.</p>
                        <p className="text-gray-500 mt-2">관심 있는 웹툰에 좋아요를 눌러보세요!</p>
                      </div>
                  )}
                </div>
              </div>

              {/*<div className="bg-white rounded-lg shadow-sm p-6 mb-8 ">*/}
              {/*  <div className="flex justify-between items-center mb-6">*/}
              {/*    <h2 className="text-xl font-bold">즐겨찾기한 웹툰</h2>*/}
              {/*  </div>*/}
              {/*  <div>*/}
              {/*    { showLoading ? (*/}
              {/*        // 빈 배열일 때*/}
              {/*        <div className="flex flex-col items-center justify-center h-64 mt-20 mb-20">*/}
              {/*          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>*/}
              {/*          <p className="text-xl font-semibold text-gray-700">데이터를 불러오는 중입니다...</p>*/}
              {/*          <p className="text-gray-500 mt-2">잠시만 기다려주세요</p>*/}
              {/*        </div>*/}

              {/*    ) : favoriteWebtoonInfoList.length > 0 ? (*/}
              {/*        // 데이터 있을 때*/}
              {/*        <WebtoonSlider*/}
              {/*            title=""*/}
              {/*            webtoons={() => Promise.resolve(favoriteWebtoonInfoList)}*/}
              {/*            cardSize={'sm'}*/}
              {/*            initialLoad={false}*/}
              {/*        />*/}
              {/*    ) : (*/}
              {/*        // 로딩 중*/}
              {/*        <div className="flex flex-col items-center justify-center h-64 mt-10 mb-10">*/}
              {/*          <p className="text-xl font-semibold text-gray-700">즐겨찾기한 웹툰이 없습니다.</p>*/}
              {/*          <p className="text-gray-500 mt-2">관심 있는 웹툰에 즐겨찾기를 눌러보세요!</p>*/}
              {/*        </div>*/}
              {/*    )}*/}
              {/*  </div>*/}
              {/*</div>*/}

              <CommentSection comments={comments} />
            </>
        );

      case "followers":
        return <FollowersList followers={followers} />;
      case "followees":
        return <FolloweesList followees={followees} />;
      case "security":
        return <ChangePassword />;
      case "privacy":
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">공개 범위 설정</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    프로필 공개 범위
                  </label>
                  <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) =>
                          handlePrivacyChange("profileVisibility", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">전체 공개</option>
                    <option value="followers">팔로워만</option>
                    <option value="private">비공개</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    댓글 공개 범위
                  </label>
                  <select
                      value={privacySettings.commentVisibility}
                      onChange={(e) =>
                          handlePrivacyChange("commentVisibility", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">전체 공개</option>
                    <option value="followers">팔로워만</option>
                    <option value="private">비공개</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    좋아요한 웹툰 공개 범위
                  </label>
                  <select
                      value={privacySettings.likeVisibility}
                      onChange={(e) =>
                          handlePrivacyChange("likeVisibility", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">전체 공개</option>
                    <option value="followers">팔로워만</option>
                    <option value="private">비공개</option>
                  </select>
                </div>
              </div>
            </div>
        );
      default:
        return null;
    }
  };

  if (error) {
    return <div>에러: {error}</div>;
  }

  if (!userInfo) {
    return <div>사용자 정보를 찾을 수 없습니다.</div>;
  }

  return (
      <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <div className="sticky top-24">
              <ProfileImageUploader userId={userInfo.indexId} />
              <BioSection userId={userInfo.indexId} />

              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <button
                    onClick={() => setActiveTab("followers")}
                    className="flex items-center gap-2 hover:text-blue-500 mb-2 w-full text-left"
                >
                <span className="font-semibold">
                  {userInfo.followerCount || 0}
                </span>{" "}
                  팔로워
                </button>
                <button
                    onClick={() => setActiveTab("followees")}
                    className="flex items-center gap-2 hover:text-blue-500 w-full text-left"
                >
                <span className="font-semibold">
                  {userInfo.followeeCount || 0}
                </span>{" "}
                  팔로잉
                </button>
              </div>

              <nav className="space-y-1">
                <button
                    onClick={() => setActiveTab("overview")}
                    className={clsx(
                        "w-full px-4 py-2 text-left rounded-md",
                        activeTab === "overview"
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                    )}
                >
                  프로필 개요
                </button>
                <button
                    onClick={() => setActiveTab("security")}
                    className={clsx(
                        "w-full px-4 py-2 text-left rounded-md",
                        activeTab === "security"
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                    )}
                >
                  보안
                </button>
                <button
                    onClick={() => setActiveTab("privacy")}
                    className={clsx(
                        "w-full px-4 py-2 text-left rounded-md",
                        activeTab === "privacy"
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                    )}
                >
                  공개 범위
                </button>
                <button
                    onClick={() => setActiveTab("followers")}
                    className={clsx(
                        "w-full px-4 py-2 text-left rounded-md",
                        activeTab === "followers"
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                    )}
                >
                  팔로워 목록
                </button>
                <button
                    onClick={() => setActiveTab("followees")}
                    className={clsx(
                        "w-full px-4 py-2 text-left rounded-md",
                        activeTab === "followees"
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                    )}
                >
                  팔로잉 목록
                </button>
              </nav>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            {message && (
                <div
                    className={clsx(
                        "mb-4 p-4 rounded",
                        message.type === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    )}
                >
                  {message.text}
                </div>
            )}
            {renderTabContent()}
          </div>
        </div>
      </div>
  );
};

export default MyProfile;