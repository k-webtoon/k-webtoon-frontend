"use client"

import { useState, useRef } from "react"
import { Button } from "@/shared/ui/shadcn/button.tsx"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/shadcn/card.tsx"
import { Badge } from "@/shared/ui/shadcn/badge.tsx"
import { Star, Heart, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"

interface Webtoon {
    id: number
    title: string
    genre: string
    author: string
    rating: number
    description: string
    image: string
    isNew?: boolean
    isTrending?: boolean
}

interface WebtoonCarouselProps {
    title: string
    webtoons: Webtoon[]
}

export default function WebtoonCarousel({ title, webtoons }: WebtoonCarouselProps) {
    const carouselRef = useRef<HTMLDivElement>(null)
    const [showLeftButton, setShowLeftButton] = useState(false)
    const [showRightButton, setShowRightButton] = useState(true)

    const scroll = (direction: "left" | "right") => {
        if (!carouselRef.current) return

        const { current: container } = carouselRef
        const scrollAmount = direction === "left" ? -container.clientWidth * 0.75 : container.clientWidth * 0.75

        container.scrollBy({ left: scrollAmount, behavior: "smooth" })

        // Update button visibility after scrolling
        setTimeout(() => {
            if (!carouselRef.current) return
            setShowLeftButton(carouselRef.current.scrollLeft > 0)
            setShowRightButton(
                carouselRef.current.scrollLeft < carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 10,
            )
        }, 300)
    }

    const handleScroll = () => {
        if (!carouselRef.current) return
        setShowLeftButton(carouselRef.current.scrollLeft > 0)
        setShowRightButton(
            carouselRef.current.scrollLeft < carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 10,
        )
    }

    return (
        <div className="relative py-6">
            <div className="container px-4 md:px-6 mb-4">
                <h2 className="text-2xl font-semibold">{title}</h2>
            </div>

            <div className="relative group">
                {showLeftButton && (
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-70 hover:opacity-100 shadow-md"
                        onClick={() => scroll("left")}
                    >
                        <ChevronLeft className="h-6 w-6" />
                        <span className="sr-only">Scroll left</span>
                    </Button>
                )}

                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto scrollbar-hide scroll-smooth pb-6 px-4 md:px-6"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    onScroll={handleScroll}
                >
                    <div className="flex gap-4">
                        {webtoons.map((webtoon) => (
                            <Card key={webtoon.id} className="flex-shrink-0 w-[220px] md:w-[250px] overflow-hidden flex flex-col">
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <img
                                        src={webtoon.image || "/placeholder.svg"}
                                        alt={webtoon.title}
                                        className="object-cover w-full h-full transition-transform hover:scale-105"
                                    />
                                    <div className="absolute top-2 left-2 flex gap-2">
                                        {webtoon.isNew && (
                                            <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">
                                                추천
                                            </Badge>
                                        )}
                                        {webtoon.isTrending && (
                                            <Badge variant="secondary" className="bg-red-500 hover:bg-red-600 text-white">
                                                인기
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <CardHeader className="p-3">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-base truncate">{webtoon.title}</CardTitle>
                                        <div className="flex items-center">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs ml-1">{webtoon.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <span>{webtoon.genre}</span>
                                        <span className="mx-1">•</span>
                                        <span>{webtoon.author}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 pt-0 flex-grow">
                                    <CardDescription className="text-xs line-clamp-2">{webtoon.description}</CardDescription>
                                </CardContent>
                                <CardFooter className="p-3 pt-0 flex gap-2">
                                    <Button size="sm" className="flex-1 h-8 text-xs">
                                        <BookOpen className="mr-1 h-3 w-3" />
                                        상세보기
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                        <Heart className="h-3 w-3" />
                                        <span className="sr-only">찜하기</span>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                {showRightButton && (
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-70 hover:opacity-100 shadow-md"
                        onClick={() => scroll("right")}
                    >
                        <ChevronRight className="h-6 w-6" />
                        <span className="sr-only">Scroll right</span>
                    </Button>
                )}
            </div>
        </div>
    )
}

