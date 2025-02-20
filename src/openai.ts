import OpenAI from 'openai';
import { CONFIG } from './config';

const openai = new OpenAI({
  apiKey: CONFIG.OPENAI_API_KEY,
});

/**
 * OpenAI APIで応答を取得
 */
export async function getOpenAIResponse(userMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "あなたは親切で丁寧な日本語アシスタントです。ユーザーの質問に対して、簡潔かつ分かりやすい日本語で回答してください。"
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content?.trim() || '申し訳ありません、回答できませんでした。';
  } catch (error) {
    console.error('OpenAI API エラー:', error);
    return '申し訳ありません。OpenAI APIでエラーが発生しました。';
  }
} 