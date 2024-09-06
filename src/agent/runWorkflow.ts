import { END, START, StateGraph } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";

import AgentState from '@/agent/agentState';
import router from '@/agent/router';
import innovationDirectorNode from '@/agent/nodes/innovationDirectorNode';
import supervisorNode from '@/agent/nodes/supervisorNode';
import researchNode from '@/agent/nodes/researchNode';
import uxDesignerNode from '@/agent/nodes/uxDesignerNode';

const runWorkflow = async (
  prompt: string,
) => {
  // Create the graph for the workflow
  const workflow = new StateGraph(AgentState)
    // add team member nodes
    // @ts-ignore
    .addNode("Supervisor", supervisorNode)
    // @ts-ignore
    .addNode("InnovationDirector", innovationDirectorNode)
    // @ts-ignore
    .addNode("Researcher", researchNode)
    // @ts-ignore
    .addNode("UxDesigner", uxDesignerNode);

  // Add edges for team members to reply back to the supervisor
  workflow.addEdge("Supervisor", "InnovationDirector");
  workflow.addEdge("InnovationDirector", "Supervisor");
  workflow.addEdge("Researcher", "Supervisor");
  workflow.addEdge("UxDesigner", "Supervisor");

  workflow.addConditionalEdges(
    "Supervisor",
    router,
    {
      UxDesigner: "UxDesigner",
      Researcher: "Researcher",
      InnovationDirector: "InnovationDirector",
      FINISH: END,
    }
  );

  workflow.addEdge(START, "Supervisor");
  workflow.addEdge("InnovationDirector", END);
  
  const graph = workflow.compile();

  const streamResults = await graph.stream(
    {
      messages: [
        new HumanMessage({
          content: prompt,
        }),
      ],
    },
    { recursionLimit: 30 },
  );

  await printOutput(streamResults);

  console.log("Workflow complete");

  return graph;
}

export const printOutput = async (streamResults: any) => {
  const prettifyOutput = (output: Record<string, any>) => {
    const keys = Object.keys(output);
    const firstItem = output[keys[0]];

    if ("messages" in firstItem && Array.isArray(firstItem.messages)) {
      const lastMessage = firstItem.messages[firstItem.messages.length - 1];
      console.dir({
        type: lastMessage._getType(),
        content: lastMessage.content,
        tool_calls: lastMessage.tool_calls,
      }, { depth: null });
    }
  }

  for await (const output of await streamResults) {
    if (!output?.__end__) {
      prettifyOutput(output);
      console.log("----");
    }
  }

  return;
}

export default runWorkflow;

