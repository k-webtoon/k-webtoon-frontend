// src/pages/user/userpage/UserProfile.tsx
import React, { useState } from "react";
import FollowButton from "@/components/FollowButton"; // 경로는 상황에 맞게 조정
import { Link, useParams } from "react-router-dom";

const UserProfile = () => {
  const { userId } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="w-full font-[Pretendard]">
      {/* 유저 정보 */}
      <div className="w-full h-[360px] relative">
        <img src="/images/background.jpg" alt="배경" className="w-full h-full object-cover" />
        <div className="absolute left-24 bottom-8 flex items-center space-x-10 z-10">
          <img
            src="/images/images.jpg"
            alt="프로필"
            className="w-[180px] h-[180px] rounded-full object-cover border-[6px] border-white shadow-xl"
          />
          <div className="bg-white text-black rounded-2xl px-6 py-4 shadow-md">
            <p className="text-[18px] font-semibold mb-2">유저 닉네임</p>
            <div className="flex space-x-8 text-[13px] text-gray-600">
              <Stat label="팔로워" value={82} />
              <Stat label="팔로잉" value={45} />
              <Stat label="평균 평가" value={4.2} />
            </div>
            <FollowButton isFollowing={isFollowing} toggleFollow={toggleFollow} />
          </div>
        </div>
      </div>

      {/* 좋아요한 웹툰 */}
      <Section title="좋아요한 웹툰">
        <CardGrid type="likes" />
        <Link to={`/user/${userId}/likes`} className="text-blue-500">전체보기</Link>
      </Section>

      {/* 코멘트 */}
      <Section title="작성한 코멘트">
        <CardGrid type="comments" />
        <Link to={`/user/${userId}/comments`} className="text-blue-500">전체보기</Link>
      </Section>

      {/* 팔로워/팔로잉 */}
      <Section title="팔로우 관계">
        <div className="flex gap-8">
          <Link to={`/user/${userId}/followers`} className="text-blue-500 underline">팔로워 보기</Link>
          <Link to={`/user/${userId}/followees`} className="text-blue-500 underline">팔로잉 보기</Link>
        </div>
      </Section>
    </div>
  );
};

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-black font-bold text-lg">{value}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <h2 className="text-base font-semibold mb-4 text-left">{title}</h2>
      {children}
    </section>
  );
}

function CardGrid({ type }: { type: string }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <WebtoonCard type={type} />
      <WebtoonCard type={type} />
      <WebtoonCard type={type} />
    </div>
  );
}

function WebtoonCard({ type }: { type: string }) {
  return (
    <div className="relative w-[180px] h-[280px] border border-gray-200 rounded-3xl p-4 flex flex-col justify-between items-start bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all ease-in-out duration-300">
      <div className="absolute top-2 right-2">
        <button className="text-white text-xl hover:text-gray-200">⋯</button>
      </div>
      <div className="flex-shrink-0 w-full h-[160px] rounded-xl overflow-hidden mb-4">
        <img src="/images/sample.jpg" alt="웹툰 썸네일" className="w-full h-full object-cover rounded-xl" />
      </div>
      <p className="font-semibold text-lg truncate">제목</p>
      <p className="text-sm text-gray-300">카테고리</p>
    </div>
  );
}

export default UserProfile;
