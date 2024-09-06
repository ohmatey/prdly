import { z } from "zod";
import { tool } from "@langchain/core/tools";

const nextAgentRoutingTool = (members: string[] = []) => {
  const routingTool = tool(
    async props => {
      return props;
    },  
    {
      name: "route",
      description: "Select the next role.",
      schema: z.object({
        reasoning: z.string(),
        next: z.enum(["FINISH", ...members]),
        instructions: z.string().describe("The specific instructions of the sub-task the next role should accomplish."),
      }),
    }
  );

  return routingTool;
}

export default nextAgentRoutingTool;