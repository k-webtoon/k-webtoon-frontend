// 서브 네비게이션 아이템 정의 및 경로 맵핑
export interface SubNavItem {
  title: string;
  href: string;
  path: string;
}

// 홈 페이지 - 비로그인
export const homeSubNavItems: SubNavItem[] = [
  { title: "AI 취향 분석", href: "/1", path: "/user-based-recommendations" },
  { title: "AI 텍스트 맞춤", href: "/2", path: "/text-based-recommendations" },
  { title: "인기웹툰", href: "/3", path: "/webtoon/list/top" },
  { title: "웹툰 캐릭터와 대화", href: "/4", path: "/character-chat" },
  { title: "인기 리뷰", href: "/5", path: "/reviews" }
];

// 홈 페이지 - 로그인

// 웹툰 페이지
export const webtoonSubNavItems: SubNavItem[] = [
  { title: "AI 취향 분석", href: "/1", path: "/user-based-recommendations" },
  { title: "전체", href: "/2", path: "/webtoon/list/top" },      // 인기순 (top)
  { title: "심장을 저격한 작품들", href: "/3", path: "/webtoon/list/likes" },   // 좋아요 (likes)
  { title: "이건 봐야 해", href: "/4", path: "/webtoon/list/watched" },         // 조회수 (watched)
  { title: "찜 안 하면 섭섭해", href: "/5", path: "/webtoon/list/favorites" }   // 즐겨찾기 (favorites)
];

// 경로를 기반으로 활성화된 서브네비게이션 아이템 찾기
export const findActiveSubNavItemByPath = (
  items: SubNavItem[], 
  currentPath: string
): SubNavItem | undefined => {
  return items.find(item => 
    currentPath === item.path || currentPath.startsWith(item.path)
  );
};

// ID를 기반으로 서브네비게이션 섹션 ID 생성
export const getSectionId = (href: string): string => {
  return `section${href.split('/').pop()}`;
};
