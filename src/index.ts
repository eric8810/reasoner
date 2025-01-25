import { Stream } from "openai/streaming";
import { ReasonerClient } from "./reasoner.client";
import { ChatCompletionChunk } from "openai/resources";
import { stdout } from "process";
import { Siliconflow, Distill } from "./llm.provider";
import { ActionerClient } from "./actioner.client";
import { weatherDoc } from "./tools.doc";
import { documentationCases, programingCases } from "./cases";
import { ReasonActionerClient } from "./reason.actioner.client";

console.log("Hello TypeScript!");
process.env.NODE_NO_WARNINGS = "1";
// Add this line to suppress the punycode warning
process.emitWarning = function (warning: string) {
  if (warning.includes("punycode")) return;
  process.stderr.write(`Warning: ${warning}\n`);
};
const reasoner = new ReasonerClient();

// 1. 抽离颜色相关代码到独立对象
const ColorUtils: {
  colors: {
    readonly reset: string;
    readonly green: string;
    readonly yellow: string;
    readonly blue: string;
    readonly magenta: string;
    readonly cyan: string;
    readonly red: string;
  };
  beautify(text: string, color: keyof typeof ColorUtils.colors): string;
} = {
  colors: {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    red: "\x1b[31m",
  },
  beautify(text: string, color: keyof typeof ColorUtils.colors) {
    return `${ColorUtils.colors[color]}${text}${ColorUtils.colors.reset}`;
  },
};

// 2. 统一的日志输出函数
const Logger = {
  info: (message: string) => console.log(ColorUtils.beautify(message, "cyan")),
  success: (message: string) =>
    console.log(ColorUtils.beautify(message, "green")),
  processStream: (chunk: string, color: keyof typeof ColorUtils.colors) => {
    process.stdout.write(ColorUtils.beautify(chunk || "", color));
  },
};

// 3. 统一的流处理函数
async function processStreamResponse(response: Stream<ChatCompletionChunk>) {
  let reason = "";
  let content = "";

  for await (const chunk of response) {
    const delta = chunk.choices[0].delta as any;

    if (delta.reasoning_content !== null) {
      reason += delta.reasoning_content || "";
      Logger.processStream(delta.reasoning_content || "", "green");
    }

    if (delta.content !== null) {
      content += delta.content || "";
      Logger.processStream(delta.content || "", "yellow");
    }
  }

  return { reason, content };
}

// 4. 重构主要功能函数
async function reasoning(query: string) {
  Logger.info("Starting reasoning...");

  const response = (await reasoner.reason([{ role: "user", content: query }], {
    max_tokens: 1,
  })) as Stream<ChatCompletionChunk>;

  const { reason, content } = await processStreamResponse(response);

  // 简化思考过程, 暂时不使用, 效果不好
  // Logger.info("Simplifying reasoning...");
  // const simplified = await reasoner.simplify([
  //   {
  //     role: "user",
  //     content: `总结下面的思考过程：\n${reason}`,
  //   },
  // ]);

  // const { content: simpleReason } = await processStreamResponse(simplified);
  Logger.success("\nReasoning complete!");

  return { reason, content };
}

// 5. 简化 action 相关函数
async function actionWithReason(query: string, reason: string) {
  const actioner = new ActionerClient(
    process.env.SILICONFLOW_API_KEY,
    process.env.SILICONFLOW_BASE_URL
  );

  Logger.info(
    `Starting actioning with ${Siliconflow.models.LLM.qwen2_5_72b_instruct.model_name} ...`
  );

  const response = await actioner.action(
    [
      { role: "user", content: query },
      { role: "assistant", content: `<reasoning>${reason}</reasoning>` },
    ],
    {
      model: Siliconflow.models.LLM.qwen2_5_72b_instruct.model_name,
    }
  );

  const { content } = await processStreamResponse(response);
  return content;
}

const action = async (query: string) => {
  const actioner = new ActionerClient(
    process.env.SILICONFLOW_API_KEY,
    process.env.SILICONFLOW_BASE_URL
  );
  console.log(
    ColorUtils.beautify(
      `Starting actioning with ${Siliconflow.models.LLM.qwen2_5_72b_instruct.model_name} ...`,
      "cyan"
    )
  );
  const response = await actioner.action([{ role: "user", content: query }], {
    model: Siliconflow.models.LLM.qwen2_5_72b_instruct.model_name,
  });
  let content = "";
  for await (const chunk of response) {
    if ((chunk.choices[0].delta as any).content !== null) {
      content += (chunk.choices[0].delta as any).content || "";
      process.stdout.write(
        ColorUtils.beautify(
          (chunk.choices[0].delta as any).content || "",
          "yellow"
        )
      );
    }
  }
  return content;
};

const reasonActioner = async (query: string) => {
  const actioner = new ReasonActionerClient(
    process.env.DEEPSEEK_API_KEY,
    process.env.DISTRILL_QWEN_BASE_URL
  );
  console.log(
    ColorUtils.beautify(
      `Starting actioning with ${Distill.models.Qwen.deepseek_r1_distill_qwen_32b.model_name} ...`,
      "cyan"
    )
  );
  const response = await actioner.action([{ role: "user", content: query }], {
    model: Distill.models.Qwen.deepseek_r1_distill_qwen_32b.model_name,
  });
  let reason = "";
  let content = "";
  for await (const chunk of response) {
    if ((chunk.choices[0].delta as any).reasoning_content !== null) {
      reason += (chunk.choices[0].delta as any).reasoning_content || "";
      process.stdout.write(
        ColorUtils.beautify(
          (chunk.choices[0].delta as any).reasoning_content || "",
          "green"
        )
      );
    }

    if ((chunk.choices[0].delta as any).content !== null) {
      content += (chunk.choices[0].delta as any).content || "";
      process.stdout.write(
        ColorUtils.beautify(
          (chunk.choices[0].delta as any).content || "",
          "yellow"
        )
      );
    }
  }

  return content;
};

// 6. 优化主函数结构
async function main() {
  // use deferent query to test different cases
  const query = programingCases[6].query;
  // const query = documentationCases[0].query;
  const useReason = process.argv.includes("--reason");
  const useDistill = process.argv.includes("--distill");

  try {
    if (useReason) {
      Logger.info("-----------------> action with reason");
      const { reason } = await reasoning(query);
      await actionWithReason(query, reason);
    } else if (useDistill) {
      Logger.info("-----------------> action with distill");
      await reasonActioner(query);
    } else {
      Logger.info("-----------------> action without reason");
      await action(query);
    }
  } catch (error: any) {
    console.error(ColorUtils.beautify(`Error: ${error.message}`, "red"));
  }
}

main();
