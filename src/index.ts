import { Stream } from "openai/streaming";
import { ReasonerClient } from "./reasoner.client";
import { ChatCompletionChunk } from "openai/resources";
import { stdout } from "process";
import { Siliconflow } from "./llm.provider";
import { ActionerClient } from "./actioner.client";
import { weatherDoc } from "./tools.doc";
import { programingCases } from "./cases";

console.log("Hello TypeScript!");
process.env.NODE_NO_WARNINGS = "1";
// Add this line to suppress the punycode warning
process.emitWarning = function (warning: string) {
  if (warning.includes("punycode")) return;
  process.stderr.write(`Warning: ${warning}\n`);
};
const reasoner = new ReasonerClient();

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
} as const;

type ColorKey = keyof typeof colors;

const beautify = (text: string, color: ColorKey) => {
  return `${colors[color]}${text}${colors.reset}`;
};

const reasoning = async (query: string) => {
  console.log(beautify("Starting reasoning...", "cyan"));

  const response = (await reasoner.reason([{ role: "user", content: query }], {
    max_tokens: 1,
  })) as Stream<ChatCompletionChunk>;

  let reason = "";
  let content = "";
  for await (const chunk of response) {
    if ((chunk.choices[0].delta as any).reasoning_content !== null) {
      reason += (chunk.choices[0].delta as any).reasoning_content || "";
      process.stdout.write(
        beautify(
          (chunk.choices[0].delta as any).reasoning_content || "",
          "green"
        )
      );
    }

    if ((chunk.choices[0].delta as any).content !== null) {
      content += (chunk.choices[0].delta as any).content || "";
      process.stdout.write(
        beautify((chunk.choices[0].delta as any).content || "", "yellow")
      );
    }
  }

  console.log(beautify("Simplifying reasoning...", "cyan"));
  const simplified = await reasoner.simplify([
    {
      role: "user",
      content: `总结下面的思考过程：
      ${reason}`,
    },
  ]);

  let simpleReason = "";
  for await (const chunk of simplified) {
    if ((chunk.choices[0].delta as any).content !== null) {
      simpleReason += (chunk.choices[0].delta as any).content || "";
      process.stdout.write(
        beautify((chunk.choices[0].delta as any).content || "", "magenta")
      );
    }
  }
  console.log(beautify("\n Reasoning complete!", "magenta"));
  return { reason, content, simpleReason };
};

const actionWithReason = async (query: string, reason: string) => {
  const actioner = new ActionerClient(
    process.env.SILICONFLOW_API_KEY,
    process.env.SILICONFLOW_BASE_URL
  );
  console.log(
    beautify(
      `Starting actioning with ${Siliconflow.models.LLM.qwen2_5_coder_32b_instruct.model_name} ...`,
      "cyan"
    )
  );
  const response = await actioner.action(
    [
      { role: "assistant", content: `<reasoning>${reason}</reasoning>` },
      { role: "user", content: query },
    ],
    {
      model: Siliconflow.models.LLM.qwen2_5_coder_32b_instruct.model_name,
    }
  );
  let content = "";
  for await (const chunk of response) {
    if ((chunk.choices[0].delta as any).content !== null) {
      content += (chunk.choices[0].delta as any).content || "";
      process.stdout.write(
        beautify((chunk.choices[0].delta as any).content || "", "yellow")
      );
    }
  }
  return content;
};

const action = async (query: string) => {
  const actioner = new ActionerClient(
    process.env.SILICONFLOW_API_KEY,
    process.env.SILICONFLOW_BASE_URL
  );
  console.log(
    beautify(
      `Starting actioning with ${Siliconflow.models.LLM.qwen2_5_coder_32b_instruct.model_name} ...`,
      "cyan"
    )
  );
  const response = await actioner.action([{ role: "user", content: query }], {
    model: Siliconflow.models.LLM.qwen2_5_coder_32b_instruct.model_name,
  });
  let content = "";
  for await (const chunk of response) {
    if ((chunk.choices[0].delta as any).content !== null) {
      content += (chunk.choices[0].delta as any).content || "";
      process.stdout.write(
        beautify((chunk.choices[0].delta as any).content || "", "yellow")
      );
    }
  }
  return content;
};

const main = async () => {
  const query = programingCases[6].query;

  const useReason = process.argv.includes("--reason");

  if (useReason) {
    const { reason, content, simpleReason } = await reasoning(query);

    console.log("-----------------> action with reason");
    const actionResultWithReason = await actionWithReason(query, simpleReason);
  } else {
    console.log("-----------------> action without reason");
    const actionResult = await action(query);
  }
};

main();
