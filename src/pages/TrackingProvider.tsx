import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { logClick, logPageView, logTyping } from "@/shared/logging/log";

export const TrackingProvider = () => {
  const location = useLocation();
  const enterTimeRef = useRef(Date.now());
  const prevPageRef = useRef<string>("");

  // ✅ 페이지 체류 시간 추적
  useEffect(() => {
    const leaveTime = Date.now();
    const duration = Math.floor((leaveTime - enterTimeRef.current) / 1000);

    if (prevPageRef.current) {
      console.log("[page-view]", {
        page: prevPageRef.current,
        duration,
        typeOfPage: typeof prevPageRef.current,
        typeOfDuration: typeof duration,
      });
      logPageView(prevPageRef.current, duration);
    }

    prevPageRef.current = location.pathname;
    enterTimeRef.current = leaveTime;
  }, [location.pathname]);

// ✅ 클릭 이벤트 추적
useEffect(() => {
  const handleClick = (e: MouseEvent) => {
    const currentPath = window.location.pathname; // 클릭 시점에 저장

    const target = e.target as HTMLElement;
    if (!target) return;

    const tag = target.tagName.toLowerCase();
    const action =
      target.getAttribute("data-action") ||
      target.innerText.slice(0, 30) ||
      "unknown";

    if (tag === "button" || tag === "a" || target.onclick) {
      console.log("[click]", {
        page: currentPath,
        action,
      });

      logClick(currentPath, action); // 페이지 전환 전에 로그 전송
    }
  };

  document.addEventListener("click", handleClick);
  return () => document.removeEventListener("click", handleClick);
}, []);

// ✅ 검색 타이핑 이벤트 추적
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement;
    
    if (!target || target.tagName.toLowerCase() !== "input") return;
    
    const keyword = target.value ? target.value.trim() : "";
    const source = target.getAttribute("data-source");

    if (e.key === "Enter" && keyword && source) {
      console.log("[typing-final]", { keyword, source });
      logTyping(keyword, source);
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, []);

  return null;
};