import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          K-TOON
        </Link>

        <div className={styles.iconGroup}>
          <div className="relative">
            <button
              className={styles.iconButton}
              onClick={() => {
                setNotificationOpen(!isNotificationOpen);
                if (isUserMenuOpen) setUserMenuOpen(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.icon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className={styles.notificationDot}></span>
            </button>

            {isNotificationOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>알림</div>
                <div className={styles.dropdownContent}>
                  <p className={styles.dropdownText}>새로운 알림이 없습니다.</p>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className={styles.iconButton}
              onClick={() => {
                setUserMenuOpen(!isUserMenuOpen);
                if (isNotificationOpen) setNotificationOpen(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.icon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {isUserMenuOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>사용자 이름</div>
                <a href="#" className={styles.menuItem}>
                  마이페이지
                </a>
                <a href="#" className={styles.menuItem}>
                  환경설정
                </a>
                <a
                  href="#"
                  className={`${styles.menuItem} ${styles.menuItemRed}`}
                >
                  로그아웃
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
