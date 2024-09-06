import type { RunnableConfig } from "@langchain/core/runnables";

import AgentState from '@/agent/agentState';
import createDirector from '@/agent/agents/createInnovationDirector';
import runAgentNode from '@/agent/runAgentNode';
import getOpenAiLlm from '@/agent/getOpenAiLlm';

const llm = getOpenAiLlm();

async function innovationDirectorNode(
  state: typeof AgentState.State,
  config?: RunnableConfig,
) {
  const members = ["Researcher", "UxDesigner", "InnovationDirector"];

  const innovationDirectorAgent = await createDirector({
    llm,
    teamMembers: members,
  });

  return runAgentNode({
    state: state,
    agent: innovationDirectorAgent,
    name: "InnovationDirector",
    config,
  });
}

export default innovationDirectorNode;