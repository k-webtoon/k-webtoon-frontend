import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card.tsx";
import { Input } from "@/shared/ui/shadcn/input.tsx";
import { Button } from "@/shared/ui/shadcn/button.tsx";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/shadcn/avatar.tsx";
import { useCharacterChatStore } from '@/entities/webtoon-character-chat/model/store.ts';
import {Character, ChatMessage} from '@/entities/webtoon-character-chat/ui/types.ts';
import josuck from "@/shared/assets/josuck.png";

const character: Character = {
    id: "1",
    name: "조석",
    avatar: josuck,
    webtoonTitle: "마음의 소리",
    webtoonIdx: 8
};

const CharacterChat: React.FC = () => {
    const [message, setMessage] = useState('');
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const {
        messages,
        isLoading,
        error,
        setCurrentCharacter,
        sendMessage,
        clearChat,
        resetError
    } = useCharacterChatStore();

    useEffect(() => {
        setCurrentCharacter(character);
    }, [setCurrentCharacter]);

    // 초기 메시지 추가
    useEffect(() => {
        if (messages.length === 0 && !isLoading) {
            const timer = setTimeout(() => {
                const initialMessage:ChatMessage = {
                    id: `initial-${Date.now()}`,
                    text: "처음이지...? 큐레이툰...응... 망했어...이미 넌 큐레이툰의 노예야...",
                    sender: 'character',
                    timestamp: new Date()
                };

                const store = useCharacterChatStore.getState();

                if (Array.isArray(store.messages) && store.messages.length === 0) {
                    store.messages = [initialMessage];
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [messages, isLoading]);

    // 메시지가 추가될 때마다 메시지 컨테이너 내부에서만 스크롤 내리기
    useEffect(() => {
        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            container.scrollTop = container.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) return;

        sendMessage(message);
        setMessage('');
    };

    // 초기화 버튼 클릭 핸들러를 래핑
    const handleClearChat = () => {
        clearChat();
        setTimeout(() => {
            const initialMessage:ChatMessage = {
                id: `initial-${Date.now()}`,
                text: "처음이지...? 큐레이툰...응... 망했어...이미 넌 큐레이툰의 노예야...",
                sender: 'character',
                timestamp: new Date()
            };

            const store = useCharacterChatStore.getState();
            if (Array.isArray(store.messages) && store.messages.length === 0) {
                store.messages = [initialMessage];
            }
        }, 100);
    };

    return (
        <Card className="w-full border border-gray-200 my-8">
            <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-800">웹툰 캐릭터와 대화하기</CardTitle>
                {error && (
                    <div className="mt-2">
                        <p className="text-sm text-red-500">{error}</p>
                        <button
                            onClick={resetError}
                            className="text-xs text-red-500 underline mt-1"
                        >
                            에러 초기화
                        </button>
                    </div>
                )}
                <p className="text-sm">다른 캐릭터와의 상호작용은 웹툰 상세페이지에서 댓글을 남기시면 받아보실 수 있습니다.</p>
            </CardHeader>

            <CardContent className="p-0">
                <div className="flex">
                    {/* 캐릭터 아바타 */}
                    <div className="w-1/3 md:w-1/4 lg:w-1/5 bg-yellow-100 p-4 flex flex-col items-center justify-center">
                        <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-lg cc-avatar-hover">
                            <AvatarImage src={character.avatar} alt={character.name} />
                            <AvatarFallback className="bg-yellow-400 text-white text-2xl">
                                {character.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-gray-800">{character.name}</h3>
                        <p className="text-sm text-gray-600">{character.webtoonTitle}</p>
                    </div>

                    {/* 채팅 영역 */}
                    <div className="w-2/3 md:w-3/4 lg:w-4/5 flex flex-col h-96">
                        {/* 메시지 목록 */}
                        <div
                            ref={messagesContainerRef}
                            className="flex-grow p-4 overflow-y-auto space-y-6 bg-gray-50 cc-message-container"
                        >
                            {messages.length === 0 ? (
                                <p className="text-gray-400 text-center mt-4">메시지가 없습니다. 대화를 시작해보세요!</p>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.sender === 'character' && (
                                            <Avatar className="w-10 h-10 mr-2 flex-shrink-0">
                                                <AvatarImage src={character.avatar} alt={character.name} />
                                                <AvatarFallback className="bg-yellow-400 text-white">
                                                    {character.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}

                                        <div className="flex flex-col">
                                            <div className="flex items-end">
                                                <div
                                                    className={`max-w-xs sm:max-w-md rounded-lg px-3 py-2 ${
                                                        msg.sender === 'user'
                                                            ? 'bg-yellow-400 text-gray-800 rounded-bl-none'
                                                            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                                    }`}
                                                >
                                                    <p className="whitespace-pre-wrap break-words text-sm">{msg.text}</p>
                                                </div>

                                                <span className="text-xs text-gray-500 mx-1">
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>

                                        {msg.sender === 'user' && (
                                            <Avatar className="w-10 h-10 ml-2 flex-shrink-0">
                                                <AvatarFallback className="bg-blue-500 text-white">나</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))
                            )}

                            {/* 타이핑 표시 */}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <Avatar className="w-10 h-10 mr-2 flex-shrink-0">
                                        <AvatarImage src={character.avatar} alt={character.name} />
                                        <AvatarFallback className="bg-yellow-400 text-white">
                                            {character.name[0]}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col">
                                        <div className="flex items-end">
                                            <div className="cc-typing-indicator">
                                                <div className="cc-typing-dot"></div>
                                                <div className="cc-typing-dot"></div>
                                                <div className="cc-typing-dot"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 메시지 입력 */}
                        <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex bg-white">
                            <Input
                                type="text"
                                placeholder="메시지를 입력하세요..."
                                className="flex-grow mr-2 cc-input-focus"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 cc-button-active"
                                disabled={isLoading}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>
                <button
                    onClick={handleClearChat}
                    className="text-xs text-gray-500 underline"
                >
                    초기화
                </button>
            </CardContent>
        </Card>
    );
};

export default CharacterChat;