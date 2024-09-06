import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { StructuredTool } from "@langchain/core/tools";
import { Runnable } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

import nextAgentRoutingTool from "@/agent/tools/nextAgentRoutingTool";

export interface createTeamSupervisorOptions {
  llm: ChatOpenAI;
  systemPrompt?: string;
  tools?: StructuredTool[];
  teamMembers?: string[];
  reviewer?: string;
}

const defaultSupervisorPrompt = `
  You are a supervisor tasked with managing a conversation between the following workers:
  {team_members}
  
  Given the following user request, respond with the worker to act next.
  Each worker will perform a task and respond with their results and status.
  InnovationDirector is the final decision-maker synthesizing inputs from all agents; ensures alignment with strategic goals and innovation potential.
  If the end output is not innovative, you will need to provide feedback from InnovationDirector to the team members to continue iterating.
  If you need help, you can ask the team members for their input.
  
  When finished, respond with FINISH.
  Select strategically to minimize the number of steps taken.
`

async function createTeamSupervisor({
  llm,
  systemPrompt = defaultSupervisorPrompt,
  tools = [],
  teamMembers = [],
  reviewer = '',
}: createTeamSupervisorOptions): Promise<Runnable> {
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
        Given the conversation above, who should act next? Or should we FINISH?
        ${reviewer ? `If the work is ready for review, select ${reviewer}.` : ''}
        Select one of: {options}
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

export default createTeamSupervisor;