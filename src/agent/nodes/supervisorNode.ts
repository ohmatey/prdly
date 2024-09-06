import type { RunnableConfig } from "@langchain/core/runnables";

import AgentState from '@/agent/agentState';
import createTeamSupervisor from '@/agent/agents/createTeamSupervisor';
import runAgentNode from '@/agent/runAgentNode';
import getOpenAiLlm from '@/agent/getOpenAiLlm';

const llm = getOpenAiLlm();

async function supervisorNode(
  state: typeof AgentState.State,
  config?: RunnableConfig,
) {
  const members = ["Researcher", "UxDesigner", "InnovationDirector"];

  const supervisorAgent = await createTeamSupervisor({
    llm,
    teamMembers: members,
    reviewer: "InnovationDirector",
  });

  return runAgentNode({
    state: state,
    agent: supervisorAgent,
    name: "Supervisor",
    config,
  });
}

export default supervisorNode;