import { BaseMessage, SystemMessage } from "@langchain/core/messages";
import { StructuredToolInterface } from "@langchain/core/tools";

const agentMessageModifier = (
  systemPrompt: string,
  tools: StructuredToolInterface[],
  teamMembers: string[],
): (messages: BaseMessage[]) => BaseMessage[] => {
  const toolNames = tools.map((t) => t.name).join(", ");
  
  const systemMsgStart = new SystemMessage(systemPrompt +
    "\nWork autonomously according to your specialty, using the tools available to you." +
    " Do not ask for clarification." +
    " Your other team members (and other teams) will collaborate with you with their own specialties." +
    ` You are chosen for a reason! You are one of the following team members: ${teamMembers.join(", ")}.`)
  
  const systemMsgEnd = new SystemMessage(`Supervisor instructions: ${systemPrompt}\n` +
    `Remember, you individually can only use these tools: ${toolNames}` +
    "\n\nEnd if you have already completed the requested task. Communicate the work completed.");

  return (messages: BaseMessage[]): any[] => 
    [systemMsgStart, ...messages, systemMsgEnd];
}

export default agentMessageModifier;