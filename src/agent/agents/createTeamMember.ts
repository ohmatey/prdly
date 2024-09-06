import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { convertToOpenAITool } from "@langchain/core/utils/function_calling";
import { StructuredTool } from "@langchain/core/tools";
import { Runnable } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

export interface createTeamMemberOptions {
  llm: ChatOpenAI;
  tools: StructuredTool[];
  systemMessage: string;
}

async function createTeamMember({
  llm,
  tools,
  systemMessage,
}: createTeamMemberOptions): Promise<Runnable> {
  const toolNames = tools.map((tool) => tool.name).join(", ");
  const formattedTools = tools.map((t) => convertToOpenAITool(t));

  const basePrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful AI assistant, collaborating with other assistants." +
      " Use the provided tools to progress towards answering the question." +
      " If you are unable to fully answer, that's OK, another assistant with different tools " +
      " will help where you left off. Execute what you can to make progress." +
      " If you or any of the other assistants have the final answer or deliverable," +
      " prefix your response with FINAL ANSWER so the team knows to stop." +
      " You have access to the following tools: {tool_names}.\n{system_message}",
    ],
    new MessagesPlaceholder("messages"),
  ]);
  
  const prompt = await basePrompt.partial({
    system_message: systemMessage,
    tool_names: toolNames,
  });

  // @ts-ignore
  return prompt.pipe(llm.bind({ tools: formattedTools }));
}

export default createTeamMember;