import React from "react";
import styles from "./WebtoonDetail.module.css";

const WebtoonDetail = () => {
  // 더미 데이터
  const webtoon = {
    title: "웹툰 이름",
    rating: 4.5,
    url: "#",
    reviews: [
      { user: "사용자1", comment: "좋아요", likes: 10 },
      { user: "사용자2", comment: "재밌어요", likes: 5 },
      { user: "사용자3", comment: "좋아요", likes: 8 },
      { user: "사용자4", comment: "재밌어요", likes: 3 },
      { user: "사용자5", comment: "좋아요", likes: 12 },
      { user: "사용자6", comment: "재밌어요", likes: 7 },
      { user: "사용자7", comment: "좋아요", likes: 9 },
      { user: "사용자8", comment: "재밌어요", likes: 4 },
    ],
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className={styles.starFilled}>
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className={styles.starEmpty}>
            ★
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.flexContainer}>
          {/* 썸네일 이미지 */}
          <div className={styles.thumbnailContainer}>
            <img
              src="https://via.placeholder.com/300x400"
              alt={webtoon.title}
              className={styles.thumbnail}
            />
          </div>

          {/* 웹툰 정보 */}
          <div className={styles.infoContainer}>
            <div className={styles.titleBox}>
              <h1 className={styles.title}>{webtoon.title}</h1>
            </div>

            <div className={styles.grid}>
              <div className={styles.infoBox}>
                <h3 className={styles.infoTitle}>평점</h3>
                <div className={styles.centerContent}>
                  {renderStars(webtoon.rating)}
                </div>
              </div>

              <div className={styles.infoBox}>
                <h3 className={styles.infoTitle}>보러가기</h3>
                <div className={styles.centerContent}>
                  <a href={webtoon.url} className={styles.link}>
                    URL
                  </a>
                </div>
              </div>

              <div className={styles.infoBox}>
                <h3 className={styles.infoTitle}>즐겨찾기</h3>
                <div className={styles.centerContent}>
                  <button className={styles.favoriteButton}>★</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 후기 섹션 */}
        <div className={styles.reviewSection}>
          <div className={styles.reviewHeader}>
            <h2 className={styles.reviewTitle}>후기</h2>
          </div>

          <div className={styles.reviewContainer}>
            <div className={styles.reviewGrid}>
              {webtoon.reviews.map((review, index) => (
                <div
                  key={index}
                  className={
                    index === 0
                      ? styles.reviewCardHighlighted
                      : styles.reviewCard
                  }
                >
                  <p className={styles.reviewUser}>{review.user}</p>
                  <p className={styles.reviewComment}>{review.comment}</p>
                  <p className={styles.reviewLikes}>좋아요: {review.likes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebtoonDetail;
