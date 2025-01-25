export const Siliconflow = {
  name: "Siliconflow",
  models: {
    VLM: {
      qvq_72b_preview: { model_name: "QVQ-72B-Preview", max_tokens: 4096 },
      qwen2_vl_72b_instruct: {
        model_name: "Qwen2-VL-72B-Instruct",
        max_tokens: 8192,
      },
      internvl2_26b: { model_name: "InternVL2-26B", max_tokens: 4096 },
      deepseek_vl2: { model_name: "deepseek-vl2", max_tokens: 4096 },
      qwen2_vl_7b_instruct_pro: {
        model_name: "Qwen2-VL-7B-Instruct (Pro)",
        max_tokens: 8192,
      },
      internvl2_8b_pro: { model_name: "InternVL2-8B (Pro)", max_tokens: 4096 },
    },
    LLM: {
      deepseek_v2_5: { model_name: "DeepSeek-V2.5", max_tokens: 8192 },
      llama_3_3_70b_instruct: {
        model_name: "Llama-3.3-70B-Instruct",
        max_tokens: 4096,
      },
      qwen2_5_coder_32b_instruct: {
        model_name: "Qwen/Qwen2.5-Coder-32B-Instruct",
        max_tokens: 32768,
      },
      qwen2_5_coder_7b_instruct: {
        model_name: "Qwen/Qwen2.5-Coder-7B-Instruct",
        max_tokens: 32768,
      },
      qwen2_5_72b_instruct: {
        model_name: "Qwen/Qwen2.5-72B-Instruct",
        max_tokens: 32768,
      },
      qwen2_5_32b_instruct: {
        model_name: "Qwen/Qwen2.5-32B-Instruct",
        max_tokens: 32768,
      },
      qwen2_5_7b_instruct: {
        model_name: "Qwen/Qwen2.5-7B-Instruct",
        max_tokens: 32768,
      },
    },
  },
};
