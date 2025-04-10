// ===============
// 도메인 엔티티 타입
// ===============

// 캐릭터 정보 타입
export interface Character {
    id: string;
    name: string;
    avatar: string;
    webtoonTitle: string;
    webtoonIdx: number;
}

// 채팅 메시지 타입
export interface ChatMessage {
    id: string;
    sender: 'user' | 'character';
    text: string;
    timestamp: Date;
    emotions?: string[];
}

// 정제된 응답 데이터 타입
export interface ProcessedCharacterResponse {
    emotions: string[];
    messageOptions: string[];
    selectedMessage?: string;
}

// ===============
// API 요청/응답 타입
// ===============

// 캐릭터 채팅 API 요청 타입
export interface CharacterChatRequest {
    comment: string;
    webtoon_idx: number;
}

// 캐릭터 채팅 API 응답 타입
export interface CharacterChatResponse {
    "feel Top3": string[];
    "message1:": string;
    "message2:": string;
    "message3:": string;
}

// ===============
// 상태 관리 타입
// ===============

export interface CharacterChatState {
    // 상태 데이터
    currentCharacter: Character | null;
    messages: ChatMessage[];
    lastResponse: ProcessedCharacterResponse | null;
    isLoading: boolean;
    error: string | null;

    // 액션 메서드
    setCurrentCharacter: (character: Character) => void;
    sendMessage: (message: string) => Promise<void>;
    clearChat: () => void;
    resetError: () => void;
}