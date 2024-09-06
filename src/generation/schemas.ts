import { z } from 'zod'

export const prdSchema = z.object({
  prd: z.object({
    problemStatement: z.string().describe('The problem statement'),
    objectiveStatement: z.string().describe('The objective statement'),
    successMetrics: z.array(z.string()).describe('The success metrics'),
    personas: z.array(z.object({
      name: z.string().describe('The name of the persona'),
      description: z.string().describe('The description of the persona'),
      goals: z.array(z.string()).describe('The goals of the persona'),
      painPoints: z.array(z.string()).describe('The pain points of the persona'),
      jobToBeDone: z.array(z.object({
        name: z.string().describe('The name of the job to be done'),
        description: z.string().describe('The description of the job to be done'),
      })).describe('1-3 jobs to be done of the persona'),
    })).describe('1-3 personas of the product'),
    assumptions: z.array(z.object({
      name: z.string().describe('The name of the assumption'),
      description: z.string().describe('The description of the assumption'),
      category: z.enum(['feasibility', 'viability', 'desirability']).describe('The category of the assumption'),
      rating: z.enum(['low', 'medium', 'high']).describe('The rating of the assumption'),
      experiments: z.array(z.object({
        type: z.enum(['exploratory', 'validation', 'Call to action']).describe('The type of the experiment'),
        name: z.string().describe('The name of the experiment'),
        description: z.string().describe('The description of the experiment'),
        successMetrics: z.array(z.string()).describe('The success metrics of the experiment'),
      })).describe('3-5 The experiments to validate the assumption. Show a range of experiments from exploratory to validation to call to action to guide the product development process'),
    })).describe('3-5 assumptions of the persona and experiments to validate the assumptions'),
  }),
})