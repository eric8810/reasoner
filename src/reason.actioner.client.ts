import OpenAI from "openai";
import dotenv from "dotenv";
import { Stream } from "openai/streaming";

const MAX_TOKENS = 4096;

dotenv.config();
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ActionRequest {
  model: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  max_tokens?: number;
  stream?: boolean;
}

export class ReasonActionerClient {
  private readonly client: OpenAI;

  constructor(apiKey?: string, baseURL?: string) {
    const key = apiKey || process.env.DEEPSEEK_API_KEY;
    if (!key) {
      throw new Error("DeepSeek API key is required");
    }

    this.client = new OpenAI({
      apiKey: key,
      baseURL: baseURL || "https://api.deepseek.com/v1",
    });
  }

  async action(messages: Message[], options: Partial<ActionRequest> = {}) {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model || "gpt-4o",
        messages: messages,
        max_tokens: options.max_tokens || MAX_TOKENS,
        stream: true,
        ...options,
      });

      return response as Stream<OpenAI.Chat.Completions.ChatCompletionChunk> & {
        _request_id?: string | null;
      };
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new Error(`DeepSeek API error: ${error.message}`);
      }
      throw error;
    }
  }
}
