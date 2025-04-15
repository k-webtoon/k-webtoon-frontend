import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wand2, Star, Sparkles, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/shadcn/button";
import { useWebtoonStore } from "@/entities/webtoon/api/store";
import { fetchRecommendedWebtoons } from "@/entities/create-id-recom/api/recommendationAPi";
import { sendWebtoonLogToSpring } from "@/entities/create-id-recom/api/sendWithAuth";

const genreTagMap = {
  "액션/스릴러": ["격투기", "다크히어로", "무협/사극", "밀리터리", "범죄", "서바이벌", "스릴러", "헌터물", "히어로"],
  "판타지/이세계": ["SF", "게임판타지", "다크판타지", "동양풍판타지", "로판", "구원서사", "몬스터", "차원이동", "회귀"],

  "로맨스": ["고자극로맨스", "현실로맨스", "궁중로맨스", "계략여주", "계약연애", "까칠남", "러블리", "비밀연애", "사내연애", "선결혼후연애"],
  "학원/청춘": ["하이틴", "학원로맨스", "학원물", "청춘로맨스", "동아리", "짝사랑", "친구>연인", "캠퍼스로맨스"],

  "감성/드라마": ["감성", "감성드라마", "성장물", "성장드라마", "의학드라마", "레트로", "하이퍼리얼리즘", "역사물"],
  "일상/힐링": ["2030연애", "동물", "음식&요리", "일상", "직업드라마", "힐링", "육아물", "음악", "인플루언서"],
  "개그/코믹": ["개그", "로맨스코미디", "공감성수치", "병맛", "병맛개그", "황당설정", "패러디", "공감개그"],

  "오컬트/서스펜스": ["감염", "괴담", "사이비종교", "서스펜스", "오컬트", "피카레스크", "이능력배틀물", "블루스트링"],
  "엔터테인먼트/아이돌": ["아이돌", "연예계", "드라마&영화 원작웹툰", "영화원작웹툰", "프리퀄", "스핀오프", "소설원작", "음악"],
  "기타/특이": ["고인물", "성별반전", "세계관", "4차원", "인외존재", "힘숨찐", "레드스트링", "성장서사"]
};

const genres = Object.keys(genreTagMap);

export default function AIRecommendation() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [selGenres, setSelGenres] = useState<string[]>([]);
  const [selTags, setSelTags] = useState<Record<string, string[]>>({});
  const [selWebtoons, setSelWebtoons] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { topWebtoonList, fetchTopWebtoons } = useWebtoonStore();
  const [recommendedList, setRecommendedList] = useState<any[]>([]);

  useEffect(() => {
    fetchTopWebtoons(0, 20);
  }, [fetchTopWebtoons]);

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

  const next = async () => {
    if (
      (step === 1 && !selGenres.length) ||
      (step === 2 && !selGenres.every((g) => (selTags[g]?.length || 0) >= 5)) ||
      (step === 3 && selWebtoons.length < 5)
    )
      return;
  
    setLoading(true);
  
    try {
      if (step === 2) {
        const groupedTags = selGenres.map((g) => selTags[g]);
        const result = await fetchRecommendedWebtoons(groupedTags);
        setRecommendedList(result);
      }
  
      if (step === 4) {
        const token = localStorage.getItem("token"); // ✅ 일관된 키 사용
        if (!token) return alert("로그인이 필요합니다.");
  
        await sendWebtoonLogToSpring(selWebtoons, token);
        alert("추천 로그 전송 완료!");
        return nav("/");
      }
  
      setStep((prev) => prev + 1);
    } catch (e) {
      console.error("에러:", e);
      alert(step === 4 ? "서버 전송 실패" : "추천 웹툰 요청 실패");
    } finally {
      setLoading(false);
    }
  };

  const back = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
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
              {[1, 2, 3].map((s) => (
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
              {step === 3 && <Star className="w-6 h-6 text-yellow-500 ml-2" />}
              {step === 4 && (
                <Sparkles className="w-6 h-6 text-yellow-500 ml-2" />
              )}
            </div>
            <span className="text-sm text-gray-500">{step}/4 단계</span>
          </div>

          {step === 1 && (
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
              <div className="flex justify-end border-t pt-4">
                <Button
                  onClick={next}
                  disabled={!selGenres.length}
                  className={`bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-4 px-8 rounded-xl ${
                    selGenres.length
                      ? "hover:from-purple-600 hover:to-indigo-600 transform hover:scale-105"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  다음
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
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
                  각 장르별로 최소 5개 이상의 태그를 선택해주세요
                </p>
                {selGenres.map((g) => (
                  <div key={g} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">{g}</h3>
                      <span className="text-sm text-purple-600">
                        {selTags[g]?.length || 0}/5+
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
                      !selGenres.every((g) => (selTags[g]?.length || 0) >= 5)
                    }
                    className={`bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-4 px-8 rounded-xl ${
                      selGenres.every((g) => (selTags[g]?.length || 0) >= 5)
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

          {step === 3 && (
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
                {recommendedList.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => toggleWebtoon(w.id)}
                    className={`relative cursor-pointer ${
                      selWebtoons.includes(w.id) ? "ring-2 ring-purple-500" : ""
                    }`}
                  >
                    {selWebtoons.includes(w.id) && (
                      <div className="absolute top-2 right-2 bg-purple-500 p-1 rounded-full">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <img
                      src={w.thumbnail}
                      alt={w.title_name}
                      className="w-full aspect-[3/4] object-cover rounded-md"
                    />
                    <div className="text-sm mt-2 text-center">
                      {w.title_name}
                    </div>
                  </div>
                ))}
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

          {step === 4 && (
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
