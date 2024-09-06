import { Runnable } from "@langchain/core/runnables";
import { HumanMessage, ToolMessage } from "@langchain/core/messages";
import type { RunnableConfig } from "@langchain/core/runnables";

import AgentState from './agentState'

async function runAgentNode(props: {
  state: typeof AgentState.State;
  agent: Runnable;
  name: string;
  config?: RunnableConfig;
}) {
  const { state, agent, name, config } = props;

  let result = await agent.invoke(state, config);
  const toolCallMessages = []
  // We convert the agent output into a format that is suitable
  // to append to the global state

  if (!result?.tool_calls || result.tool_calls.length === 0) {
    // If the agent is NOT calling a tool, we want it to
    // look like a human message.
    const recentMessage = result?.messages[result.messages.length - 1]

    result = new HumanMessage({ ...recentMessage, name });
  } else {
    // Iterate over each tool call and process the response
    for (const toolCall of result.tool_calls) {
      // Append the tool response to the result
      toolCallMessages.push(
        new ToolMessage({
          name,
          content: toolCall.id,
          tool_call_id: toolCall.id,
        })
      );
    }
  }

  const nextRouteToolCall = result?.tool_calls?.find(
    (x: { name: string }) => x.name === "route"
  );

  return {
    messages: [result, ...toolCallMessages] as HumanMessage[],
    // Since we have a strict workflow, we can
    // track the sender so we know who to pass to next.
    sender: name,
    next: nextRouteToolCall?.args?.next,
  };
}

export default runAgentNode;