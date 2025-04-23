import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wand2, Star, Sparkles, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/shadcn/button";
import { useWebtoonStore } from "@/entities/webtoon/api/store";
import { fetchRecommendedWebtoons } from "@/entities/create-id-recom/api/recommendationAPi";
import { sendWebtoonLogToSpring } from "@/entities/create-id-recom/api/sendWithAuth";
import WebtoonCard from "@/entities/webtoon/ui/WebtoonCard.tsx";

const genreTagMap = {
  "로맨스/멜로": ["로맨스", "학원로맨스", "캠퍼스로맨스", "청춘로맨스", "현실로맨스", "오피스로맨스", "계약연애", "선결혼후연애", "소꿉친구", "삼각관계"],
  "드라마/일상": ["드라마", "일상", "직업드라마", "하이퍼리얼리즘", "음식&요리", "동아리", "레트로", "성장드라마"],
  "판타지/무협": ["판타지", "먼치킨", "무협/사극", "빙의", "게임판타지", "차원이동", "타임슬립", "이세계", "동양풍판타지"],
  "액션/스릴러": ["스릴러", "액션", "서스펜스", "아포칼립스", "복수극", "느와르", "범죄", "서바이벌", "머니게임", "격투기"],
  "코믹/개그": ["무료", "개그", "4차원", "사이다", "걸크러시", "로맨스코미디", "무해한", "두뇌싸움", "공감성수치", "까칠남"],
  "웹툰/원작": ["소설원작", "드라마&영화 원작웹툰", "영화원작웹툰", "스핀오프", "프리퀄", "슈퍼스트링", "레드스트링", "블루스트링", "세계관", "해외작품"],
  "감성/힐링": ["감성", "힐링", "구원서사", "다정남", "재회", "짝사랑", "후회물", "친구>연인", "비밀연애", "감성드라마"],
  "시대극/가상": ["최강자전", "퓨전사극", "역사물", "소년왕도물", "판무", "다크판타지", "고인물", "회귀"],
  "관계/성장": ["연예계", "인플루언서", "아이돌", "연상연하", "사내연애", "집착물", "아이돌연애", "스포츠성장"],
  "특이/인외존재": ["좀비", "SF", "괴담", "오컬트", "사이비종교", "밀리터리", "뱀파이어", "이능력배틀물", "히어로", "인외존재"]
};

const genres = Object.keys(genreTagMap);

export default function AIRecommendation() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [selGenres, setSelGenres] = useState<string[]>([]);
  const [selTags, setSelTags] = useState<Record<string, string[]>>({});
  const [selWebtoons, setSelWebtoons] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { fetchTopWebtoons, fetchWebtoonById } = useWebtoonStore();
  const [recommendedList, setRecommendedList] = useState<any[]>([]);
  const [webtoonDetails, setWebtoonDetails] = useState<Record<number, any>>({});
  const [selPopClass, setSelPopClass] = useState<number[]>([]);
  const [selThumbClass, setSelThumbClass] = useState<number[]>([]);


  useEffect(() => {
    fetchTopWebtoons(0, 20);
  }, [fetchTopWebtoons]);

  // 렌더링 시점이 아닌 선택된 웹툰 목록이 변경될 때마다 웹툰 정보를 로드
  useEffect(() => {
    // 추천 목록이 있을 때만 실행
    if (recommendedList.length > 0) {
      // 아직 로드되지 않은 웹툰 정보만 로드
      recommendedList.forEach(webtoon => {
        if (webtoon && webtoon.id && !webtoonDetails[webtoon.id]) {
          // 비동기로 웹툰 정보 로드
          (async () => {
            try {
              await fetchWebtoonById(webtoon.id);
              const webtoonDetail = useWebtoonStore.getState().currentWebtoon;

              if (webtoonDetail) {
                // API에서 가져온 웹툰 정보를 복사하여 필요한 처리를 진행
                const processedDetail = { ...webtoonDetail };

                // starScore 필드 정규화 (숫자 형식으로 변환)
                if (processedDetail.starScore === undefined || processedDetail.starScore === null) {
                  processedDetail.starScore = 0;
                } else if (typeof processedDetail.starScore !== 'number') {
                  try {
                    processedDetail.starScore = parseFloat(processedDetail.starScore) || 0;
                  } catch (e) {
                    processedDetail.starScore = 0;
                  }
                }

                // AI 추천 API에서 받아온 웹툰 정보
                const recommendedWebtoon = recommendedList.find(w => w.id === webtoon.id);

                // 웹툰 장르 정보 디버깅 로그
                console.log("웹툰 상세 정보:", {
                  id: processedDetail.id,
                  title: processedDetail.titleName,
                  rankGenreTypes: processedDetail.rankGenreTypes,
                  genre: recommendedWebtoon?.genre,
                  genre_list: recommendedWebtoon?.genre_list
                });

                // 장르 정보가 없거나 비어있는 경우 AI 추천 API의 장르 정보를 활용
                if (!processedDetail.rankGenreTypes || !Array.isArray(processedDetail.rankGenreTypes) || processedDetail.rankGenreTypes.length === 0) {
                  console.log(`ID:${webtoon.id} - 장르 정보 없음, 대체 정보 설정 시도`);

                  // AI 추천 API의 genre_list, genre 필드 활용 시도
                  if (recommendedWebtoon?.genre_list && Array.isArray(recommendedWebtoon.genre_list) && recommendedWebtoon.genre_list.length > 0) {
                    processedDetail.rankGenreTypes = recommendedWebtoon.genre_list.map(genre => {
                      // genre가 문자열인지 확인하고 대문자로 변환
                      return typeof genre === 'string'
                          ? genre.toUpperCase() as any
                          : 'DRAMA';
                    });
                    console.log(`ID:${webtoon.id} - AI 추천 genre_list 필드로 대체:`, processedDetail.rankGenreTypes);
                  }
                  // genre 필드 활용
                  else if (recommendedWebtoon?.genre) {
                    const genre = typeof recommendedWebtoon.genre === 'string'
                        ? recommendedWebtoon.genre.toUpperCase()
                        : 'DRAMA';
                    processedDetail.rankGenreTypes = [genre as any];
                    console.log(`ID:${webtoon.id} - AI 추천 genre 필드로 대체:`, processedDetail.rankGenreTypes);
                  }
                  // 기본값 설정
                  else {
                    processedDetail.rankGenreTypes = ['DRAMA'];
                    console.log(`ID:${webtoon.id} - 기본 장르 'DRAMA' 설정`);
                  }
                }

                setWebtoonDetails(prev => ({
                  ...prev,
                  [webtoon.id]: processedDetail
                }));
              }
            } catch (error) {
              console.error(`웹툰 ID ${webtoon.id} 정보 가져오기 실패:`, error);
            }
          })();
        }
      });
    }
  }, [recommendedList, webtoonDetails, fetchWebtoonById]);

  const toggleGenre = (g: string) => {
    setSelGenres((prev) =>
        prev.includes(g)
            ? prev.filter((x) => x !== g)
            : prev.length < 3
                ? [...prev, g]
                : prev
    );
    setSelTags((prev) => ({ ...prev, [g]: prev[g] || [] }));
  };

  const toggleTag = (g: string, t: string) => {
    setSelTags((prev) => {
      const tags = prev[g] || [];
      return {
        ...prev,
        [g]: tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t],
      };
    });
  };

  const toggleWebtoon = (id: number) => {
    setSelWebtoons((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const togglePopClass = (id: number) => {
    setSelPopClass((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const toggleThumbClass = (id: number) => {
    setSelThumbClass((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const next = async () => {
    if (
        (step === 3 && !selGenres.length ) ||
        (step === 4 && !selGenres.every((g) => (selTags[g]?.length || 0) >= 3)) ||
        (step === 5 && selWebtoons.length < 5)
    ) return;

    setLoading(true);
    try {
      if (step === 4) {
        const groupedTags = selGenres.map((g) => selTags[g]);
        const result = await fetchRecommendedWebtoons({
          tagList: groupedTags,
          popClass: selPopClass,
          thumbClass: selThumbClass,
        });
        setRecommendedList(result);

        // 가능한 경우 웹툰 상세 정보 미리 로드
        if (result && result.length > 0) {
          setRecommendedList(result);
          // 웹툰 정보는 useEffect에서 처리되므로 여기서는 별도 로직 필요 없음
        } else {
          setRecommendedList([]);
        }
      }

      if (step === 6) {
        const token = localStorage.getItem("token");
        if (!token) return alert("로그인이 필요합니다.");
        await sendWebtoonLogToSpring(selWebtoons, token);
        alert("추천 로그 전송 완료!");
        return nav("/");
      }

      setStep((prev) => prev + 1);
    } catch (e) {
      console.error("에러:", e);
      alert(step === 6 ? "서버 전송 실패" : "추천 웹툰 요청 실패");
    } finally {
      setLoading(false);
    }
  };

  const back = () => setStep(step - 1);

  return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI 맞춤 추천 설정
            </h1>
            <p className="text-gray-500">
              당신의 취향을 분석하여 맞춤 웹툰을 추천해드립니다
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4, 5, 6].map((s) => (
                    <div
                        key={s}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            s <= step
                                ? "bg-purple-500 text-white"
                                : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      {s}
                    </div>
                ))}
                {step === 5 && <Star className="w-6 h-6 text-yellow-500 ml-2" />}
                {step === 6 && (
                    <Sparkles className="w-6 h-6 text-yellow-500 ml-2" />
                )}
              </div>
              <span className="text-sm text-gray-500">{step}/6 단계</span>
            </div>

            {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center text-purple-500">어떤 종류의 웹툰을 좋아하시나요?</h2>
                  <p className="text-center text-gray-500 text-purple-400">최대 2개까지 선택할 수 있어요 (선택 안 해도 괜찮아요!)</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 0, label: "🏆 국민 웹툰", desc: "모두가 아는 레전드 인기작" },
                      { id: 5, label: "🔥 요즘 가장 핫한 웹툰", desc: "요즘 반응 폭발하는 신작들" },
                      { id: 2, label: "🌟 꾸준한 인기작", desc: "오랫동안 사랑받는 웹툰" },
                      { id: 4, label: "🍃 조용한 명작", desc: "알아보는 사람만 아는 몰입감" },
                      { id: 1, label: "💎 숨겨진 보석", desc: "아직 덜 알려졌지만 퀄리티 보장" },
                      { id: 3, label: "🌱 성장 중인 웹툰", desc: "가능성 넘치는 신작들" },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => togglePopClass(item.id)}
                            className={`p-4 rounded-xl border text-left ${
                                selPopClass.includes(item.id)
                                    ? "border-purple-500 bg-purple-50 text-purple-600 font-medium"
                                    : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/50"
                            }`}
                        >
                          <div className="text-lg">{item.label}</div>
                          <div className="text-sm text-gray-500">{item.desc}</div>
                        </button>
                    ))}
                  </div>
                  <div className="flex justify-end border-t pt-4">
                    <Button
                        onClick={next}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-3 px-8 rounded-xl hover:from-purple-600 hover:to-indigo-600 transform hover:scale-105"
                    >
                      다음
                    </Button>
                  </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center text-purple-500">좋아하는 썸네일 분위기를 골라주세요</h2>
                  <p className="text-center text-gray-500 text-purple-400">최대 2개까지 선택할 수 있어요 (선택 안 해도 괜찮아요!)</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        id: 0,
                        emoji: "🌟",
                        title: "밝고 사랑스러운",
                        desc: "설레는 감정의 썸네일",
                        images: [
                          "https://image-comic.pstatic.net/webtoon/570503/thumbnail/thumbnail_IMAG21_7b907ee6-a61e-495b-9b8f-be2f0a4be44b.jpeg",
                          "https://image-comic.pstatic.net/webtoon/703846/thumbnail/thumbnail_IMAG21_3617626786448291892.jpg",
                        ],
                      },
                      {
                        id: 1,
                        emoji: "🌙",
                        title: "감성적인",
                        desc: "몽환적, 서정적 감성",
                        images: [
                          "https://image-comic.pstatic.net/webtoon/699415/thumbnail/thumbnail_IMAG21_7233968694859411814.jpg",
                          "https://image-comic.pstatic.net/webtoon/551649/thumbnail/thumbnail_IMAG21_7221630172870686053.jpg",
                        ],
                      },
                      {
                        id: 2,
                        emoji: "🎨",
                        title: "고퀄리티 일러스트",
                        desc: "작품 같은 썸네일",
                        images: [
                          "https://image-comic.pstatic.net/webtoon/746834/thumbnail/thumbnail_IMAG21_6412ed6b-2288-41df-8715-648a3da9154e.jpg",
                          "https://image-comic.pstatic.net/webtoon/783769/thumbnail/thumbnail_IMAG21_fc14e4e2-e62f-4d77-8f46-9fb05cffa77a.jpeg",
                        ],
                      },
                      {
                        id: 3,
                        emoji: "⚔️",
                        title: "액션/판타지",
                        desc: "움직임 있고 전투 느낌",
                        images: [
                          "https://image-comic.pstatic.net/webtoon/318995/thumbnail/thumbnail_IMAG21_38f18e00-09f2-4a0c-b36a-3aa56dfe0b3b.jpg",
                          "https://image-comic.pstatic.net/webtoon/662774/thumbnail/thumbnail_IMAG21_3618421729916171318.jpg",
                        ],
                      },
                      {
                        id: 4,
                        emoji: "🔥",
                        title: "진지하고 긴장감 있는",
                        desc: "강렬한 눈빛, 어두운 배경",
                        images: [
                          "https://image-comic.pstatic.net/webtoon/710747/thumbnail/thumbnail_IMAG21_3545518418129085537.jpg",
                          "https://image-comic.pstatic.net/webtoon/26108/thumbnail/thumbnail_IMAG21_4062582645276620852.JPEG",
                        ],
                      },
                      {
                        id: 5,
                        emoji: "😱",
                        title: "공포/스릴러",
                        desc: "기묘하고 위협적인 느낌",
                        images: [
                          "https://image-comic.pstatic.net/webtoon/557672/thumbnail/thumbnail_IMAG21_7365744050293924710.jpg",
                          "https://image-comic.pstatic.net/webtoon/701081/thumbnail/thumbnail_IMAG21_3761692268951647077.jpg",
                        ],
                      },
                      {
                        id: 6,
                        emoji: "😂",
                        title: "코믹하고 일상적인",
                        desc: "귀엽고 웃긴 썸네일",
                        images: [
                          "https://image-comic.pstatic.net/webtoon/651673/thumbnail/thumbnail_IMAG21_fba9683b-260e-4a07-984c-deda6d87f62d.jpg",
                          "https://image-comic.pstatic.net/webtoon/81482/thumbnail/thumbnail_IMAG21_3702579259720938341.jpg",
                        ],
                      },
                    ].map((item) => (
                        <div
                            key={item.id}
                            onClick={() => toggleThumbClass(item.id)}
                            className={`p-4 rounded-xl border text-left ${
                                selThumbClass.includes(item.id)
                                    ? "border-indigo-500 bg-indigo-50 text-indigo-600 font-medium"
                                    : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50"
                            }`}
                        >
                          <div className="text-lg text-gray-700">{item.emoji} {item.title}</div>
                          <div className="text-sm text-gray-400">{item.desc}</div>
                          <div className="flex gap-2 mt-2">
                            {item.images.map((image, index) => (
                                <img key={index} src={image} alt={`${item.title} 썸네일 ${index + 1}`} className="w-42 h-55 object-cover rounded-md" />
                            ))}
                          </div>
                        </div>
                    ))}
                  </div>
                  <div className="flex justify-between border-t pt-4">
                    <Button onClick={back} variant="outline" className="flex items-center">
                      <ArrowLeft className="w-4 h-4 mr-2" /> 이전
                    </Button>
                    <Button
                        onClick={next}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-3 px-8 rounded-xl hover:from-purple-600 hover:to-indigo-600 transform hover:scale-105"
                    >
                      다음
                    </Button>
                  </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center">
                    <Wand2 className="w-8 h-8 text-purple-500 mr-2" />
                    <h2 className="text-2xl font-bold">
                      관심 있는 장르를 선택해주세요
                    </h2>
                  </div>
                  <p className="text-center text-gray-500">
                    최대 3개까지 선택 가능합니다 ({selGenres.length}/3)
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {genres.map((g) => (
                        <button
                            key={g}
                            onClick={() => toggleGenre(g)}
                            className={`p-4 rounded-xl border text-base ${
                                selGenres.includes(g)
                                    ? "border-purple-500 bg-purple-50 text-purple-600 font-medium"
                                    : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/50"
                            }`}
                        >
                          {g}
                        </button>
                    ))}
                  </div>
                  <div className="flex justify-between border-t pt-4">
                    <Button
                        onClick={back}
                        variant="outline"
                        className="flex items-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      이전
                    </Button>
                    <Button
                        onClick={next}
                        disabled={
                          step === 3
                              ? selGenres.length === 0
                              : !selGenres.every((g) => (selTags[g]?.length || 0) >= 1)
                        }
                        className={`bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-4 px-8 rounded-xl ${
                            (step === 3
                                ? selGenres.length > 0
                                : selGenres.every((g) => (selTags[g]?.length || 0) >= 1))
                                ? "hover:from-purple-600 hover:to-indigo-600 transform hover:scale-105"
                                : "opacity-50 cursor-not-allowed"
                        }`}
                    >
                      다음
                    </Button>
                  </div>
                </div>
            )}

            {step === 4 && (
                <div className="relative space-y-6">
                  {" "}
                  {/* ✅ 여기에 relative 추가 */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-yellow-500 mr-2" />
                      <h2 className="text-2xl font-bold">
                        선호하는 태그를 선택해주세요
                      </h2>
                    </div>
                    <p className="text-center text-gray-500">
                      각 장르별로 최소 3개 이상의 태그를 선택해주세요
                    </p>
                    {selGenres.map((g) => (
                        <div key={g} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{g}</h3>
                            <span className="text-sm text-purple-600">
                        {selTags[g]?.length || 0}/3+
                      </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {genreTagMap[g].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => toggleTag(g, t)}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        selTags[g]?.includes(t)
                                            ? "bg-purple-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                  {t}
                                </button>
                            ))}
                          </div>
                        </div>
                    ))}
                    <div className="flex justify-between border-t pt-4">
                      <Button
                          onClick={back}
                          variant="outline"
                          className="flex items-center"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        이전
                      </Button>
                      <Button
                          onClick={next}
                          disabled={
                            !selGenres.every((g) => (selTags[g]?.length || 0) >= 3)
                          }
                          className={`bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-4 px-8 rounded-xl ${
                              selGenres.every((g) => (selTags[g]?.length || 0) >= 3)
                                  ? "hover:from-purple-600 hover:to-indigo-600 transform hover:scale-105"
                                  : "opacity-50 cursor-not-allowed"
                          }`}
                      >
                        다음
                      </Button>
                    </div>
                    {/* ✅ 로딩 오버레이 - 이 div 위에만 덮임 */}
                    {loading && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl space-y-4">
                          <div className="animate-spin rounded-full border-4 border-purple-500 border-t-transparent w-12 h-12"></div>
                          <p className="text-sm text-gray-600 font-medium">
                            추천 웹툰 분석 중입니다...
                          </p>
                        </div>
                    )}
                  </div>
                </div>
            )}

            {step === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center">
                    <Star className="w-8 h-8 text-yellow-500 mr-2" />
                    <h2 className="text-2xl font-bold">추천 웹툰</h2>
                  </div>
                  <p className="text-center text-gray-500">
                    선택하신 취향을 바탕으로 인기 웹툰을 추천해드립니다
                  </p>
                  <p className="text-center text-purple-600 text-sm">
                    관심있는 웹툰을 최소 5개 이상 선택해주세요 ({selWebtoons.length}
                    /5+)
                  </p>
                  <p className="text-center text-purple-400 text-xs -mt-3">
                    ※ 많이 선택하실수록 추천 정확도가 높아집니다
                  </p>
                  <div className="grid grid-cols-3 gap-4 max-h-[500px] overflow-auto">
                    {recommendedList.map((w) => {
                      // 웹툰 상세 정보 가져오기 (캐시에 있으면 사용)
                      const webtoonDetail = webtoonDetails[w.id] || null;

                      return (
                          <div
                              key={w.id}
                              onClick={() => toggleWebtoon(w.id)}
                              className="relative cursor-pointer"
                          >
                            {/* 선택 표시를 위한 보라색 오버레이 */}
                            <div className={`absolute inset-0 right-2 border-4 border-purple-500 rounded-lg z-10 pointer-events-none ${
                                selWebtoons.includes(w.id) ? "opacity-100" : "opacity-0"
                            }`}></div>

                            {/* 체크 표시 */}
                            {selWebtoons.includes(w.id) && (
                                <div className="absolute top-2 right-5 bg-purple-500 p-1 rounded-full z-20">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                            )}

                            {/* 상세 정보가 있으면 WebtoonCard 사용, 없으면 기본 이미지 표시 */}
                            {webtoonDetail ? (
                                <div className="relative">
                                  {/* AI 추천 API에서 받은 정보를 웹툰 상세정보에 추가 */}
                                  <WebtoonCard
                                      webtoon={{
                                        ...webtoonDetail,
                                        // 추가 AI 추천 정보 병합
                                        genre: w.genre,
                                        genre_list: w.genre_list || [],
                                      }}
                                      size="xs"
                                      showBadges={false}
                                      showActionButtons={false}
                                      showGenre={true}
                                      isLink={false}
                                  />
                                </div>
                            ) : (
                                <>
                                  <img
                                      src={w.thumbnail}
                                      alt={w.title_name}
                                      className="w-full aspect-[3/4] object-cover rounded-md"
                                  />
                                  <div className="text-sm mt-2 text-center">
                                    {w.title_name}
                                  </div>
                                  {/* 장르 정보가 있으면 표시 */}
                                  {w.genre && (
                                      <div className="text-xs text-gray-500 text-center">
                                        {typeof w.genre === 'string' ? w.genre : ''}
                                      </div>
                                  )}
                                </>
                            )}
                          </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between border-t pt-4">
                    <div className="flex justify-start">
                      <Button
                          onClick={back}
                          variant="outline"
                          className="flex items-center"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        이전
                      </Button>
                    </div>
                    <Button
                        onClick={next}
                        disabled={selWebtoons.length < 5}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-indigo-600 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      선택 완료
                    </Button>
                  </div>
                </div>
            )}

            {step === 6 && (
                <div className="space-y-8">
                  <div className="flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-yellow-500 mr-2" />
                    <h2 className="text-2xl font-bold">선호 취향 분석 결과</h2>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">선택하신 장르</h3>
                    <div className="flex flex-wrap gap-2">
                      {selGenres.map((genre) => (
                          <span
                              key={genre}
                              className="px-4 py-2 bg-purple-500 text-white rounded-full"
                          >
                      {genre}
                    </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">선택하신 태그</h3>
                    <div className="space-y-4">
                      {selGenres.map((genre) => (
                          <div key={genre}>
                            <h4 className="font-medium mb-2">{genre}</h4>
                            <div className="flex flex-wrap gap-2">
                              {selTags[genre]?.map((tag) => (
                                  <span
                                      key={tag}
                                      className="px-3 py-1 bg-indigo-500 text-white rounded-full text-sm"
                                  >
                            {tag}
                          </span>
                              ))}
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">선택하신 웹툰</h3>
                    <div className="grid grid-cols-5 gap-4">
                      {selWebtoons.map((id) => {
                        const w = recommendedList.find((w) => w.id === id);
                        return w ? (
                            <div key={id} className="space-y-2">
                              <div className="aspect-[3/4] overflow-hidden rounded-lg">
                                <img
                                    src={w.thumbnail}
                                    alt={w.title_name}
                                    className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-sm font-medium truncate">
                                {w.title_name}
                              </p>
                            </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className="flex justify-between pt-6">
                    <div className="flex justify-start">
                      <Button
                          onClick={back}
                          variant="outline"
                          className="flex items-center"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        이전
                      </Button>
                    </div>
                    <Button
                        onClick={next}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-xl transform hover:scale-105 transition-all duration-200"
                    >
                      AI 추천 받기
                    </Button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
