// src/pages/user/mypage/MyProfile.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "@/entities/user/model/userStore";
import useAuthStore from "@/entities/auth/model/userStore";
import { usePasswordStore } from "@/entities/auth/model/newPasswordStore";
import { useProfileStore } from "@/entities/user/model/profileStore";
import {
  UserInfo,
  UserComment,
  LikedWebtoon,
  FollowUser,
} from "@/entities/user/model/types";
import { WebtoonInfo } from "@/entities/webtoon/ui/types.ts";
import WebtoonCard from "@/entities/webtoon/ui/WebtoonCard";
import { CommentCard } from "@/entities/user/ui/CommentCard";
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { clsx } from "clsx";
import { useUserActivityStore } from "@/entities/user/model/profileStore";

// 탭 타입 정의
type TabType =
  | "overview"
  | "settings"
  | "security"
  | "privacy"
  | "followers"
  | "followees"
  | "recommendation-settings"; // 새로운 탭 추가

// LikedWebtoon을 TopWebtoonInfo로 변환하는 함수
const convertToTopWebtoonInfo = (webtoon: LikedWebtoon): WebtoonInfo => ({
  id: webtoon.id,
  titleId: webtoon.id,
  titleName: webtoon.title,
  author: "작가명", // API에서 제공하지 않는 경우 기본값
  adult: false,
  age: "전체연령가",
  finish: false,
  thumbnailUrl: webtoon.thumbnailUrl,
  synopsis: "",
  rankGenreTypes: ["DRAMA"],
  starScore: 0,
});

export const MyProfile = () => {
  // location에서 전달된 사용자 정보 확인
  const location = useLocation();
  const locationUserInfo = location.state?.userInfo;

  const { updateProfileImage, loading: imageLoading } = useProfileStore();
  // @ts-ignore
  const { user } = useAuthStore();
  const { changePassword, loading } = usePasswordStore();
  const {
    userInfo,
    comments,
    likedWebtoons,
    followers,
    followees,
    error,
    fetchMyInfo,
    fetchMyLikedWebtoons,
    fetchMyComments,
    fetchFollowers,
    fetchFollowees,
    setUserInfo,
    updateUserInfo,
    updateUserBio,
  } = useUserStore();

  // 상태 관리
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<UserInfo | null>(null);
  const [isBioEditing, setIsBioEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    commentVisibility: "public",
    likeVisibility: "public",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    // location.state에서 사용자 정보가 넘어왔는지 확인
    const userId = locationUserInfo?.indexId || user?.indexId;

    if (userId) {
      console.log("프로필 페이지에서 사용할 사용자 ID:", userId);
      fetchMyInfo(userId);
      fetchMyLikedWebtoons(userId);
      fetchMyComments(userId);
      fetchFollowers(userId);
      fetchFollowees(userId);
    } else {
      console.error("사용자 ID를 찾을 수 없습니다:", {
        locationUserInfo,
        user,
      });
    }
  }, [
    locationUserInfo,
    user,
    fetchMyInfo,
    fetchMyLikedWebtoons,
    fetchMyComments,
    fetchFollowers,
    fetchFollowees,
  ]);

  //이미지 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];

    // 파일 유효성 검사 (예: 2MB 이하 이미지)
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "이미지 파일만 업로드 가능합니다." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "2MB 이하 이미지만 업로드 가능합니다.",
      });
      return;
    }

    try {
      await updateProfileImage(file);
      setMessage({
        type: "success",
        text: "프로필 이미지가 업데이트되었습니다",
      });

      // 프로필 정보 갱신
      if (userInfo) {
        const newUserInfo = { ...userInfo };
        const reader = new FileReader();
        reader.onload = (e) => {
          newUserInfo.profileImage = e.target?.result as string;
          setUserInfo(newUserInfo);
        };
        reader.readAsDataURL(file);
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    }
  };
  // 프로필 업데이트 핸들러
  const handleProfileUpdate = async () => {
    try {
      // TODO: 프로필 업데이트 API 호출 구현
      if (editedInfo) {
        // 닉네임이나 다른 정보가 수정된 경우
        await updateUserInfo(editedInfo);
      }
      if (isBioEditing) {
        // 소개가 수정된 경우
        await updateUserBio(editedBio);
        setUserInfo((prev) => (prev ? { ...prev, bio: editedBio } : null));
      }
      setIsEditing(false);
      setIsBioEditing(false);
      setMessage({ type: "success", text: "프로필이 업데이트되었습니다." });
    } catch (error) {
      setMessage({ type: "error", text: "프로필 업데이트에 실패했습니다." });
    }
  };

  const {
    userActivityInfo,
    fetchUserActivity,
    updateUserActivityBio,
    loading: activityLoading,
  } = useUserActivityStore();

  useEffect(() => {
    const userId = locationUserInfo?.indexId || user?.indexId;

    if (userId) {
      fetchUserActivity(userId);
    }
  }, [locationUserInfo, user, fetchUserActivity]);

  // 댓글 삭제 핸들러
  const handleCommentDelete = async (commentId: number) => {
    // TODO: 댓글 삭제 API 호출 구현
  };

  // 비밀번호 변경 핸들러
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await changePassword(passwordData);
      setMessage({
        type: "success",
        text: "비밀번호가 성공적으로 변경되었습니다.",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error: undefined | any) {
      setMessage({
        type: "error",
        text: error.message || "비밀번호 변경 중 오류가 발생했습니다.",
      });
    }
  };

  // 공개 범위 설정 핸들러
  const handlePrivacyChange = async (setting: string, value: string) => {
    setPrivacySettings((prev) => ({ ...prev, [setting]: value }));
    // TODO: 공개 범위 설정 API 호출
    setMessage({ type: "success", text: "설정이 저장되었습니다." });
  };

  // 탭 콘텐츠 렌더링 함수
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            {/* 활동 요약 카드 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">활동 요약</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-medium">찜한 웹툰</h3>
                    <p className="text-2xl font-bold">{likedWebtoons.length}</p>
                  </CardContent>
                </Card>
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
            {/* 좋아요한 웹툰 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">좋아요한 웹툰</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedWebtoons.map((webtoon) => (
                  <WebtoonCard
                    key={webtoon.id}
                    webtoon={convertToTopWebtoonInfo(webtoon)}
                    size="sm"
                    showActionButtons={false}
                  />
                ))}
                {likedWebtoons.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <p className="text-lg font-medium">
                      아직 좋아요한 웹툰이 없습니다
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 작성한 댓글 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">작성한 댓글</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comments.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    webtoonId={comment.webtoonId}
                    onDelete={() => handleCommentDelete(comment.id)}
                  />
                ))}
                {comments.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="text-lg font-medium">
                      아직 작성한 댓글이 없습니다
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        );
      case "recommendation-settings":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">추천 기준 설정</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  선호 장르
                </label>
                <select className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="drama">드라마</option>
                  <option value="action">액션</option>
                  <option value="romance">로맨스</option>
                  <option value="comedy">코미디</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  완결 여부
                </label>
                <select className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">모두</option>
                  <option value="completed">완결</option>
                  <option value="ongoing">연재 중</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연령가
                </label>
                <select className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">전체 연령가</option>
                  <option value="teen">청소년</option>
                  <option value="adult">성인</option>
                </select>
              </div>
            </div>
          </div>
        );
      case "followers":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">팔로워 목록</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {followers?.map((follower) => (
                <Link key={follower.indexId} to={`/user/${follower.indexId}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src="/images/profile-placeholder.jpg"
                          alt={follower.nickname}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium">{follower.nickname}</h3>
                          <p className="text-sm text-gray-500">
                            {follower.userEmail}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {(!followers || followers.length === 0) && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-lg font-medium">아직 팔로워가 없습니다</p>
                </div>
              )}
            </div>
          </div>
        );
      case "followees":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">팔로잉 목록</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {followees?.map((followee) => (
                <Link key={followee.indexId} to={`/user/${followee.indexId}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src="/images/profile-placeholder.jpg"
                          alt={followee.nickname}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium">{followee.nickname}</h3>
                          <p className="text-sm text-gray-500">
                            {followee.userEmail}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {(!followees || followees.length === 0) && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-lg font-medium">
                    아직 팔로잉하는 사용자가 없습니다
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">프로필 설정</h2>
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    닉네임
                  </label>
                  <input
                    type="text"
                    value={editedInfo?.nickname || ""}
                    onChange={(e) =>
                      setEditedInfo((prev) =>
                        prev ? { ...prev, nickname: e.target.value } : null
                      )
                    }
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={editedInfo?.userEmail || ""}
                    onChange={(e) =>
                      setEditedInfo((prev) =>
                        prev ? { ...prev, userEmail: e.target.value } : null
                      )
                    }
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    성별
                  </label>
                  <select
                    value={editedInfo?.gender || ""}
                    onChange={(e) =>
                      setEditedInfo((prev) =>
                        prev ? { ...prev, gender: e.target.value } : null
                      )
                    }
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택하세요</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                    <option value="OTHER">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    나이
                  </label>
                  <input
                    type="number"
                    value={editedInfo?.userAge || ""}
                    onChange={(e) =>
                      setEditedInfo((prev) =>
                        prev
                          ? { ...prev, userAge: parseInt(e.target.value) }
                          : null
                      )
                    }
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    프로필 이미지 URL
                  </label>
                  <input
                    type="text"
                    value={editedInfo?.profileImage || ""}
                    onChange={(e) =>
                      setEditedInfo((prev) =>
                        prev ? { ...prev, profileImage: e.target.value } : null
                      )
                    }
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이미지 URL을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    소개
                  </label>
                  <textarea
                    value={editedInfo?.bio || ""}
                    onChange={(e) =>
                      setEditedInfo((prev) =>
                        prev ? { ...prev, bio: e.target.value } : null
                      )
                    }
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="자신을 소개해주세요"
                  />
                </div>

                {/* 웹페이지 알림 설정 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    웹페이지 알림 설정
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="web-notifications"
                      checked={editedInfo?.notificationEnabled || false}
                      onChange={(e) =>
                        setEditedInfo((prev) =>
                          prev
                            ? {
                                ...prev,
                                notificationsEnabled: e.target.checked,
                              }
                            : null
                        )
                      }
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="web-notifications"
                      className="text-sm text-gray-700"
                    >
                      웹페이지 알림 받기
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedInfo(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleProfileUpdate}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    저장
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    닉네임
                  </h3>
                  <p className="text-gray-900">{userInfo?.nickname}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    이메일
                  </h3>
                  <p className="text-gray-900">{userInfo?.userEmail}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    성별
                  </h3>
                  <p className="text-gray-900">
                    {userInfo?.gender === "MALE"
                      ? "남성"
                      : userInfo?.gender === "FEMALE"
                      ? "여성"
                      : userInfo?.gender === "OTHER"
                      ? "기타"
                      : "미설정"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    나이
                  </h3>
                  <p className="text-gray-900">
                    {userInfo?.userAge || "미설정"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    소개
                  </h3>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {userInfo?.bio || "소개가 없습니다."}
                  </p>
                </div>

                {/* 웹페이지 알림 설정 표시 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    웹페이지 알림 설정
                  </h3>
                  <p className="text-gray-900">
                    {userInfo?.notificationEnabled
                      ? "알림이 활성화되어 있습니다."
                      : "알림이 비활성화되어 있습니다."}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditedInfo(userInfo);
                  }}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  프로필 수정
                </button>
              </div>
            )}
          </div>
        );
      case "security":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">비밀번호 변경</h2>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmNewPassword: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                비밀번호 변경
              </button>
            </form>
          </div>
        );
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

  // 로딩 상태 처리
  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 에러 상태 처리
  if (error) {
    return <div>에러: {error}</div>;
  }

  // 사용자 정보가 없는 경우 처리
  if (!userInfo) {
    return <div>사용자 정보를 찾을 수 없습니다.</div>;
  }

  // 메인 컴포넌트 렌더링
  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 왼쪽 프로필 섹션 */}
        <div className="w-full md:w-1/4">
          <div className="sticky top-24">
            {/* 프로필 이미지 영역 시작 */}
            <div className="mb-4">
              <div className="w-full aspect-square rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 relative group">
                <img
                  src={
                    userActivityInfo?.profileImage ||
                    userInfo.profileImage ||
                    "/images/profile-placeholder.jpg"
                  }
                  alt="프로필"
                  className="w-full h-full object-cover"
                />
                {/* File input button remains the same */}
                <label className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-white text-sm">
                    {imageLoading ? "업로드 중..." : "이미지 변경"}
                  </span>
                </label>
              </div>
              <h1 className="text-2xl font-bold mb-1">{userInfo.nickname}</h1>
              <p className="text-gray-600 mb-4">{userInfo.userEmail}</p>
            </div>

            {/* 소개 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">소개</h3>
                {!isBioEditing ? (
                  <button
                    onClick={() => {
                      setIsBioEditing(true);
                      setEditedBio(userInfo.bio || "");
                    }}
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    수정
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsBioEditing(false);
                        setEditedBio("");
                      }}
                      className="text-gray-500 hover:text-gray-600 text-sm"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => {
                        handleProfileUpdate();
                        setIsBioEditing(false);
                      }}
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      저장
                    </button>
                  </div>
                )}
              </div>
              {isBioEditing ? (
                <textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="자신을 소개해주세요"
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">
                  {userActivityInfo?.bio || userInfo.bio || "소개가 없습니다."}
                </p>
              )}
            </div>

            {/* 팔로우 통계 */}
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

            {/* 탭 네비게이션 */}
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
                onClick={() => setActiveTab("recommendation-settings")}
                className={clsx(
                  "w-full px-4 py-2 text-left rounded-md",
                  activeTab === "recommendation-settings"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                추천 기준 설정
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={clsx(
                  "w-full px-4 py-2 text-left rounded-md",
                  activeTab === "settings"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                프로필 설정
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

        {/* 오른쪽 콘텐츠 섹션 */}
        <div className="flex-1">
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
