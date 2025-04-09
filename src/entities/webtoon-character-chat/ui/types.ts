// API 요청 타입
export interface CharacterChatRequest {
    comment: string;
    webtoon_idx: number;
}

// API 응답 타입
export interface CharacterChatResponse {
    "feel Top3": string[];
    "message1:": string;
    "message2:": string;
    "message3:": string;
}

// 정제된 응답 타입
export interface ProcessedCharacterResponse {
    emotions: string[];
    messageOptions: string[];
    selectedMessage?: string;
}

// 채팅 메시지 타입
export interface ChatMessage {
    id: string;
    sender: 'user' | 'character';
    text: string;
    timestamp: Date;
    emotions?: string[];
}

// 캐릭터 정보 타입
export interface Character {
    id: string;
    name: string;
    avatar: string;
    webtoonTitle: string;
    webtoonIdx: number;
}