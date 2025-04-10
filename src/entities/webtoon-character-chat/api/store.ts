import { create } from 'zustand';
import { sendCharacterChat, processCharacterResponse } from '@/entities/webtoon-character-chat/api/api';
import {
    CharacterChatRequest,
    ChatMessage,
    Character,
    CharacterChatState
} from '@/entities/webtoon-character-chat/model/types';
import { v4 as uuidv4 } from 'uuid';

export const useCharacterChatStore = create<CharacterChatState>((set, get) => ({
    currentCharacter: null,
    messages: [],
    lastResponse: null,
    isLoading: false,
    error: null,

    // 현재 캐릭터 설정
    setCurrentCharacter: (character: Character) => {
        set({ currentCharacter: character });
    },

    // 메시지 전송 및 응답 처리
    sendMessage: async (message: string) => {
        const { currentCharacter } = get();

        if (!currentCharacter) {
            set({ error: '캐릭터가 선택되지 않았습니다.' });
            return;
        }

        const userMessage: ChatMessage = {
            id: uuidv4(),
            sender: 'user',
            text: message,
            timestamp: new Date()
        };

        set(state => ({
            messages: [...state.messages, userMessage],
            isLoading: true,
            error: null
        }));

        const requestData: CharacterChatRequest = {
            comment: message,
            webtoon_idx: currentCharacter.webtoonIdx
        };

        try {
            const response = await sendCharacterChat(requestData);
            const processedResponse = processCharacterResponse(response);

            const randomIndex = Math.floor(Math.random() * processedResponse.messageOptions.length);
            const selectedMessage = processedResponse.messageOptions[randomIndex];

            set({ isLoading: false });

            setTimeout(() => {
                const characterMessage: ChatMessage = {
                    id: uuidv4(),
                    sender: 'character',
                    text: selectedMessage,
                    timestamp: new Date(),
                    emotions: processedResponse.emotions
                };

                set(state => ({
                    messages: [...state.messages, characterMessage],
                    lastResponse: {
                        ...processedResponse,
                        selectedMessage
                    }
                }));
            }, 300);

        } catch (error) {
            console.error('캐릭터 채팅 오류:', error);
            set({
                error: '캐릭터와의 대화 중 오류가 발생했습니다.',
                isLoading: false
            });
        }
    },

    // 채팅 기록 초기화
    clearChat: () => {
        set({ messages: [], lastResponse: null });
    },

    // 오류 상태 초기화
    resetError: () => {
        set({ error: null });
    }
}));