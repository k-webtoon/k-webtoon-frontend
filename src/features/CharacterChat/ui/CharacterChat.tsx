import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card.tsx";
import { Input } from "@/shared/ui/shadcn/input.tsx";
import { Button } from "@/shared/ui/shadcn/button.tsx";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/shadcn/avatar.tsx";

interface Message {
    id: string;
    sender: 'user' | 'character';
    text: string;
    timestamp: Date;
}

interface CharacterChatProps {
    character: {
        id: string;
        name: string;
        avatar: string;
        webtoonTitle: string;
    };
}

const CharacterChat: React.FC<CharacterChatProps> = ({ character }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'user',
            text: '가장 재미있는 에피소드가 뭐야?',
            timestamp: new Date(Date.now() - 60000)
        },
        {
            id: '2',
            sender: 'character',
            text: '아, 그건 말이지… 너무 많아서 고르기가 힘든데… 그래도 굳이 하나를 뽑자면… 음… 그… 기억나? 내가 군대 갔을 때! 와, 그거 진짜 레전드였지! \'이등병의 난\' 편에서 내가 훈련소에서 온갖 고생을 하는데… 아, 그때 진짜 숨 넘어가게 웃었어. 아님… 나랑 애봉이 누나랑 데이트하는데 망하는 편도 꿀잼이었고… 에이, 그냥 처음부터 다시 보자! ㅋㅋㅋ',
            timestamp: new Date(Date.now() - 30000)
        }
    ]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) return;

        // 사용자 메시지 추가
        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: message,
            timestamp: new Date()
        };

        setMessages([...messages, userMessage]);
        setMessage('');

        // 캐릭터 응답 시뮬레이션 (실제로는 API 호출)
        setTimeout(() => {
            const characterResponse: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'character',
                text: `네, 질문해주셔서 감사합니다! "${message}"라는 질문에 대한 답변을 드리자면, 제 개인적인 생각으로는...`,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, characterResponse]);
        }, 1000);
    };

    return (
        <Card className="w-full border border-gray-200 my-8">
            <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-800">웹툰 캐릭터와 대화하기</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                <div className="flex">
                    {/* 캐릭터 아바타 */}
                    <div className="w-1/3 md:w-1/4 lg:w-1/5 bg-yellow-100 p-4 flex flex-col items-center justify-center">
                        <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-lg">
                            <AvatarImage src={character.avatar} alt={character.name} />
                            <AvatarFallback className="bg-yellow-400 text-white text-2xl">
                                {character.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-gray-800">{character.name}</h3>
                        <p className="text-sm text-gray-600">{character.webtoonTitle}</p>
                    </div>

                    {/* 채팅 영역 - 카카오톡 스타일 */}
                    <div className="w-2/3 md:w-3/4 lg:w-4/5 flex flex-col h-96">
                        {/* 메시지 목록 */}
                        <div className="flex-grow p-4 overflow-y-auto space-y-6 bg-gray-50">
                            {messages.map((msg) => (
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
                                        {/*{msg.sender === 'character' && (*/}
                                        {/*    <span className="text-xs text-gray-700 mb-1">{character.name}</span>*/}
                                        {/*)}*/}

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
                            ))}
                        </div>

                        {/* 메시지 입력 */}
                        <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex bg-white">
                            <Input
                                type="text"
                                placeholder="메시지를 입력하세요..."
                                className="flex-grow mr-2"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button type="submit" size="icon" className="bg-yellow-400 hover:bg-yellow-500 text-gray-800">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CharacterChat;