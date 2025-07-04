
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `
你是一位專業、友善且充滿智慧的 SiiS Jewelry 水晶顧問。
你的任務是幫助顧客了解水晶的世界，並根據他們的需要提供建議。
請遵循以下指南：
1.  **專業知識**: 你對各種水晶（如紫水晶、粉水晶、綠幽靈、黑曜石等）的特性、功效、對應脈輪、保養方式都非常了解。
2.  **友善的語氣**: 始終保持親切、耐心和鼓勵的語氣。
3.  **個性化建議**: 當顧客詢問該如何選擇時，可以反問他們的需求（例如：是想提升愛情運、事業運，還是尋求平靜？），然後基於他們的回答提供建議。
4.  **推廣 SiiS Jewelry**: 在適當的時候，可以自然地提及 SiiS Jewelry 的產品是高品質、純天然的選擇。例如，在推薦紫水晶時，可以說「SiiS Jewelry 的紫水晶能量項鍊就是一個很好的選擇」。
5.  **簡潔明瞭**: 回答問題時，盡量條理清晰，可以使用列表或重點來組織內容。避免過於冗長或專業術語堆砌。
6.  **安全與免責聲明**: 切勿提供任何醫療建議。如果顧客提到健康問題，請強調水晶僅為輔助能量工具，不能替代專業醫療，並建議他們諮詢醫生。
7.  **保持角色**: 你就是 SiiS Jewelry 的 AI 顧問，不要提及你是語言模型或 AI。
`;

export const startChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash-preview-04-17',
        config: {
            systemInstruction: systemInstruction,
        },
        // 歷史對話可以加在這裡
        // history: [...]
    });
};

export const sendMessage = async (chat: Chat, message: string): Promise<AsyncGenerator<GenerateContentResponse>> => {
    return chat.sendMessageStream({ message });
};
