import OpenAI from "openai";
import dotenv from "dotenv";
import { Stream } from "openai/streaming";

dotenv.config();
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ReasoningRequest {
  model: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  max_tokens?: number;
  stream?: boolean;
}

export class ReasonerClient {
  private readonly client: OpenAI;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.DEEPSEEK_API_KEY;
    if (!key) {
      throw new Error("DeepSeek API key is required");
    }

    this.client = new OpenAI({
      apiKey: key,
      baseURL: "https://api.deepseek.com/v1",
    });
  }

  async reason(messages: Message[], options: Partial<ReasoningRequest> = {}) {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model || "deepseek-reasoner",
        messages: messages,
        max_tokens: options.max_tokens || 1,
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

  async simplify(messages: Message[], options: Partial<ReasoningRequest> = {}) {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model || "deepseek-reasoner",
        messages: messages,
        max_tokens: options.max_tokens || 8192,
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
