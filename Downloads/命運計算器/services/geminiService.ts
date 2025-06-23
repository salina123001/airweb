import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserInput, CalculationResults, AIInterpretation } from '../types';

// Ensure process.env.API_KEY is handled by the build/runtime environment
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API Key is not configured. Please set REACT_APP_GEMINI_API_KEY or API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); 

const parseJsonResponse = (responseText: string): AIInterpretation | null => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    const parsedData = JSON.parse(jsonStr);
    // Validate all expected fields are present and are strings
    if (parsedData && 
        typeof parsedData.loveFortune === 'string' &&
        typeof parsedData.careerWealth === 'string' &&
        typeof parsedData.personalGrowth === 'string' &&
        typeof parsedData.yearlyLuckForecast === 'string' &&
        typeof parsedData.futureThreeMonthsForecast === 'string') { // Added new field check
      return parsedData as AIInterpretation;
    }
    console.error("Parsed JSON does not match expected AIInterpretation structure or is missing fields:", parsedData);
    return null;
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", e);
    console.error("Original response text for debugging:", responseText);
    return null;
  }
};


export const getAIInterpretations = async (
  userInput: UserInput,
  calcResults: CalculationResults
): Promise<AIInterpretation> => {
  if (!API_KEY) {
    return {
        loveFortune: "API 金鑰未設定。請管理員檢查設定。",
        careerWealth: "無法連接至 AI 服務。",
        personalGrowth: "請稍後再試。",
        yearlyLuckForecast: "流年運勢暫時無法取得。",
        futureThreeMonthsForecast: "未來三個月運勢暫時無法取得。" // Added fallback
    }
  }
  
  const birthTimeInfo = userInput.birthTime ? `\n- 出生時間：${userInput.birthTime}` : "";
  const currentYear = new Date().getFullYear(); // Still needed for yearly luck context, but instructed to not mention it.

  const prompt = `
您是一位資深的命理大師，精通東方生肖、西方星座及數字命理學。請基於以下個人資訊，用神秘、有洞察力且充滿支持性的語氣，提供個人化的命運解讀。請使用自然溫暖的繁體中文。

個人資訊：
- 生肖：${calcResults.chineseZodiac}
- 星座：${calcResults.astrologySign}
- 生命靈數：${calcResults.lifePathNumber}
- 性別：${userInput.gender}${birthTimeInfo}

請針對以下五個方面提供解讀，每個方面至少70字：
1. 愛情運勢
2. 事業與財運建議
3. 個人成長方向
4. 流年運勢 (針對當前的年份的整體趨勢，包括機會與挑戰，請勿在您的回覆中提及任何西元年份數字，例如 '${currentYear}')
5. 未來三個月運勢 (描述接下來約三個月的整體能量、情緒和機遇趨勢。請勿在您的回覆中提及任何西元年份數字或具體的月份名稱，例如「一月」、「二月」。請使用如「接下來的第一個階段」、「隨後的時光」、「近期的未來」等較為概括的時間描述方式。)

請以JSON格式回覆，確保JSON的有效性。JSON物件應包含五個鍵：\`loveFortune\`、\`careerWealth\`、\`personalGrowth\`、\`yearlyLuckForecast\`、\`futureThreeMonthsForecast\`，其值為對應的繁體中文解讀文字。例如：
{
  "loveFortune": "您的愛情運勢顯示...",
  "careerWealth": "在事業與財運方面...",
  "personalGrowth": "關於個人成長...",
  "yearlyLuckForecast": "您在當年的整體運勢顯示...",
  "futureThreeMonthsForecast": "在接下來的三個月裡，您可能會感覺到能量的轉變..."
}
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.78, 
        topP: 0.95,
        topK: 64
      },
    });

    const interpretation = parseJsonResponse(response.text);
    if (!interpretation) {
        if (!(response.text.includes("```"))) { 
             console.error("Raw response text from Gemini causing parsing issue:", response.text);
        }
        throw new Error("無法解析來自AI的命理解讀。回應內容可能不是有效的JSON格式或缺少必要欄位。請檢查主控台以獲取詳細資訊。");
    }
    return interpretation;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    let errorMessage = "向AI請求命理解讀時發生錯誤，請稍後再試。";
    if (error instanceof Error) {
        if (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID")) {
            errorMessage = "Gemini API 金鑰無效。請檢查您的設定。";
        } else if (error.message.includes("quota") || error.message.includes("Quota")) {
            errorMessage = "已達到API使用限額，請稍後再試。";
        } else if (error.message.includes("JSON")) {
             errorMessage = error.message;
        }
    }
     return {
        loveFortune: `無法取得愛情運勢分析：${errorMessage}`,
        careerWealth: `無法取得事業財運建議：${errorMessage}`,
        personalGrowth: `無法取得個人成長方向：${errorMessage}`,
        yearlyLuckForecast: `無法取得流年運勢：${errorMessage}`,
        futureThreeMonthsForecast: `無法取得未來三個月運勢：${errorMessage}` // Added fallback
    };
  }
};