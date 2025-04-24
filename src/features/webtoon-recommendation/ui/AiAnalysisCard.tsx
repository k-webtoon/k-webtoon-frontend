import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/shared/ui/shadcn/button"
import { Card, CardContent } from "@/shared/ui/shadcn/card"
import { Typography } from "@mui/material"

interface AiRecommendCardProps {
    nickname?: string
}

const AiAnalysisCard: React.FC<AiRecommendCardProps> = ({ nickname = "" }) => {
    const [displayText, setDisplayText] = useState("")
    // 이모티콘을 별도 상태로 분리
    const emoji = "📌"
    const textPart = ` ${nickname}님의 취향 분석`
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTyping, setIsTyping] = useState(true)

    useEffect(() => {
        // 텍스트 부분만 타이핑 효과 적용
        if (currentIndex < textPart.length && isTyping) {
            const timeout = setTimeout(() => {
                setDisplayText((prev) => prev + textPart[currentIndex])
                setCurrentIndex((prevIndex) => prevIndex + 1)
            }, 100)

            return () => clearTimeout(timeout)
        } else if (currentIndex >= textPart.length) {
            const resetTimeout = setTimeout(() => {
                setIsTyping(false)
                setCurrentIndex(textPart.length - 1)
            }, 1500)

            return () => clearTimeout(resetTimeout)
        } else if (!isTyping && currentIndex >= 0) {
            const deleteTimeout = setTimeout(() => {
                setDisplayText((prev) => prev.slice(0, -1))
                setCurrentIndex((prevIndex) => prevIndex - 1)
            }, 50)

            return () => clearTimeout(deleteTimeout)
        } else if (!isTyping && currentIndex < 0) {
            const restartTimeout = setTimeout(() => {
                setIsTyping(true)
                setCurrentIndex(0)
                setDisplayText("")
            }, 100)

            return () => clearTimeout(restartTimeout)
        }
    }, [currentIndex, isTyping, textPart])

    return (
        <Card className="w-full border border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50 relative overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-200 rounded-full opacity-20 -mt-20 -mr-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-200 rounded-full opacity-20 -mb-16 -ml-16"></div>

                <div className="flex justify-center mb-2 relative z-10">
                    <div className="px-4 py-2 rounded-full inline-flex items-center">
                        <Typography
                            variant="h5"
                            component="h2"
                            sx={{
                                fontWeight: "bold",
                                color: "#dd6b20",
                                fontSize: "1.25rem",
                                lineHeight: "1.75rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                            }}
                        >
                            <span className="mr-1 transform hover:scale-110 transition-transform duration-300">{emoji}</span>
                            {displayText}
                            <span
                                style={{
                                    borderRight: "2px solid #dd6b20",
                                    marginLeft: "2px",
                                    animation: "blink 1s step-end infinite",
                                }}
                            >
                &nbsp;
              </span>
                        </Typography>
                    </div>
                </div>

                <Typography
                    variant="body1"
                    sx={{
                        mb: 4,
                        textAlign: "center",
                        fontWeight: 500,
                    }}
                    className="relative z-10"
                >
          <span className="inline-block relative">
            {nickname}님을 알아가고 있는 중입니다.
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-orange-200 to-amber-200 opacity-50"></span>
          </span>
                </Typography>

                <div className="flex justify-center relative z-10">
                    <Link to="/ai-recommendation" style={{ textDecoration: "none" }}>
                        <Button
                            variant="outline"
                            className="border-2 border-yellow-600 text-yellow-700 hover:bg-yellow-50 bg-white bg-opacity-70 px-6 h-12 rounded-full font-medium"
                        >
                            AI 맞춤 추천 설정하러 가기
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default AiAnalysisCard