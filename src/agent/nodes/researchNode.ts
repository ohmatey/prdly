import type { RunnableConfig } from "@langchain/core/runnables";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

import agentMessageModifier from '@/agent/prompts/agentMessageModifier';
import AgentState from '@/agent/agentState';
import runAgentNode from '@/agent/runAgentNode';
import getOpenAiLlm from '@/agent/getOpenAiLlm';

const llm = getOpenAiLlm();

async function researchNode(
  state: typeof AgentState.State,
  config?: RunnableConfig,
) {
  const messageModifier = agentMessageModifier(
    "You are a world class PHD level research agent assistant.",
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
    name: "Researcher",
    config,
  });
}

export default researchNode;