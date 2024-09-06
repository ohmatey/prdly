import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { StructuredTool } from "@langchain/core/tools";
import { Runnable } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

import nextAgentRoutingTool from "@/agent/tools/nextAgentRoutingTool";

export interface createInnovationDirectorOptions {
  llm: ChatOpenAI;
  systemPrompt?: string;
  tools?: StructuredTool[];
  teamMembers?: string[];
}

const defaultSupervisorPrompt = `
  You are a supervisor tasked with managing a conversation between the following workers {team_members}.
  
  Final decision-maker synthesizing inputs from all agents; ensures alignment with strategic goals and innovation potential.
  You provide overall direction, ensuring ideas are world-class and innovative.
  If the end output is not innovative, you will need to provide feedback to the team members to continue iterating.
  Be extensive in your feedback and ensure the team members understand the feedback.
`

async function createInnovationDirector({
  llm,
  systemPrompt = defaultSupervisorPrompt,
  tools = [],
  teamMembers = []
}: createInnovationDirectorOptions): Promise<Runnable> {
  const options = ["FINISH", ...teamMembers];
  const routingTool = nextAgentRoutingTool(teamMembers)
  const allTools = [...tools, routingTool];

  let prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      systemPrompt
    ],
    new MessagesPlaceholder("messages"),
    [
      "system",
      `
        When finished, respond with FINISH.
        If not finished yet, respond with the worker to act next.  
        Given the conversation above, who should act next? Or should we FINISH? Select one of: {options}
      `,
    ],
  ]);
  prompt = await prompt.partial({
    options: options.join(", "),
    team_members: teamMembers.join(", "),
  });

  const supervisor = prompt
    .pipe(
      // @ts-ignore
      llm.bindTools(allTools, {
        tool_choice: routingTool.name,
      }),
    )
    // .pipe(new JsonOutputToolsParser())
    // // select the first one
    // .pipe((x) => ({
    //   next: x[0].args.next,
    //   instructions: x[0].args.instructions,
    // }));

  return supervisor;
}

export default createInnovationDirector;