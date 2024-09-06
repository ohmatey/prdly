import { ChatOpenAI } from "@langchain/openai";

const getOpenAiLlm = (modelName: string = "gpt-4o-mini") => {
  const llm = new ChatOpenAI({ modelName });

  return llm;
}

export default getOpenAiLlm;