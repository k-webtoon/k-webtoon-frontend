import React, { useState } from "react";
import { SubTabItem } from "@/entities/navigation/model/types";

interface SubNavigationProps {
    activeTab: string;
    subTabItems: SubTabItem[];
}

export const SubNavigation: React.FC<SubNavigationProps> = ({
                                                                subTabItems,
                                                            }) => {
    // 현재 활성화된 서브탭을 추적하는 상태
    const [activeSubTab, setActiveSubTab] = useState("section1");

    // 스크롤 이동 함수
    const scrollToSection = (sectionId: string) => (e: React.MouseEvent) => {
        e.preventDefault();

        // 활성화된 서브탭 상태 업데이트
        setActiveSubTab(sectionId);

        const section = document.getElementById(sectionId);
        if (section) {
            // 헤더 높이를 고려하여 스크롤 위치 조정
            const headerHeight = 80; // 헤더와 서브네비게이션 높이에 맞게 조정
            const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: sectionTop,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="border-b bg-white/70 backdrop-blur-sm">
            <div className="container mx-auto">
                <ul className="flex overflow-x-auto py-3 px-4 whitespace-nowrap">
                    {subTabItems.map((item, index) => {
                        // href에서 섹션 ID 추출 (예: "/tag/korea" -> "section-korea")
                        const sectionId = `section${item.href.split('/').pop()}`;

                        // 활성화 여부에 따른 클래스 결정
                        const isActive = activeSubTab === sectionId;
                        const linkClass = isActive
                            ? "text-sm font-bold text-gray-900 transition-colors"
                            : "text-sm text-gray-600 hover:text-gray-900 transition-colors";

                        return (
                            <li key={index} className="mr-6">
                                <a
                                    href={`#${sectionId}`}
                                    onClick={scrollToSection(sectionId)}
                                    className={linkClass}
                                >
                                    {item.title}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};