import axios from "axios";
import {
    CharacterChatRequest,
    CharacterChatResponse,
    ProcessedCharacterResponse
} from "@/entities/webtoon-character-chat/model/types.ts";

const BASE_URL = 'http://localhost:8080/api';

// 캐릭터 채팅 API
export const sendCharacterChat = async (
    payload: CharacterChatRequest
): Promise<CharacterChatResponse> => {
    const response = await axios.post(
        `${BASE_URL}/connector/sendC`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
};

// 응답 데이터 처리
export const processCharacterResponse = (response: CharacterChatResponse): ProcessedCharacterResponse => {
    return {
        emotions: response["feel Top3"],
        messageOptions: [
            response["message1:"],
            response["message2:"],
            response["message3:"]
        ]
    };
};