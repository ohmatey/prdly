
import { z } from "zod";
import { tool } from "@langchain/core/tools";

const planSchema = z.object({
  steps: z
    .array(z.string())
    .describe("different steps to follow, should be in sorted order"),
})

const planStepsTool = () => {
  const routingTool = tool(
    async props => {
      return props;
    },  
    {
      name: "route",
      description: "Select the next role.",
      schema: planSchema,
    }
  );

  return routingTool;
}

export default planStepsTool;