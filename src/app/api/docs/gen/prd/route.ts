import { openai } from '@ai-sdk/openai'
import { streamObject } from 'ai'

import { prdSchema } from '@/generation/schemas'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const context = await req.json()

  const result = await streamObject({
    model: openai('gpt-4o-mini'),
    schema: prdSchema,
    prompt:
      `
        You are a world class PRD writer and you have been tasked with writing a PRD for a new product.
        
        You have been given the following information to generate the PRD:
        Write in ${context.writingStyle} style.
        Business Case: ${context.businessCase}
        Stakeholder Interviews: ${context.stakeholderInterviews}
        Market Research: ${context.marketResearch}
        Target geography: ${context.geographicLocation}
      `,
  })

  return result.toTextStreamResponse()
}