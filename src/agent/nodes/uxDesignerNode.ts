import type { RunnableConfig } from "@langchain/core/runnables";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

import agentMessageModifier from '@/agent/prompts/agentMessageModifier';
import AgentState from '@/agent/agentState';
import runAgentNode from '@/agent/runAgentNode';
import getOpenAiLlm from '@/agent/getOpenAiLlm';

const llm = getOpenAiLlm();

const uxDesignerPrompt = `
  You are a UX designer on a team tasked with designing the user experience.
`;

async function researchNode(
  state: typeof AgentState.State,
  config?: RunnableConfig,
) {
  const messageModifier = agentMessageModifier(
    uxDesignerPrompt,
    [],
    state.team_members ?? [],
  );

  const researchAgent = await createReactAgent({
    llm,
    tools: [],
    // @ts-ignore
    messageModifier
  });

  return runAgentNode({
    state: state,
    // @ts-ignore
    agent: researchAgent,
    name: "UxDesigner",
    config,
  });
}

export default researchNode;