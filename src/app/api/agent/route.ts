import type { NextRequest, NextResponse } from 'next/server'

import runWorkflow from '@/agent/runWorkflow';
 
type ResponseData = {
  message: string
}
 
export const POST = async (
  request: NextRequest,
  response: NextResponse<ResponseData>
) => {
  const prompt = `
    Generate a PRD for a new feature that allows users to search for and book Muay Thai gyms across Thailand.

    The features should allow users to search for gyms by location, price, and class schedule. Users should be able to view gym details, class schedules, and book classes.
    The features should also allow gym owners to create and manage their gym profiles, class schedules, and bookings.
    The features should be accessible on both web and mobile platforms.
    The features should be designed to be scalable and easy to maintain.

    Key focuses:
    - User experience
    - Feasibility
    - Sustainability
    - How it fits in the existing user journey of a Muay Thai enthusiast's journey to find and book a Muay Thai gym
    - Accessibility in particular mobile platforms

    Please provide a detailed PRD that includes the following and no more:
    - Value proposition
    - User personas
    - User stories
    
    Only once the document would be approved by InnovationDirector, the document is considered final.
    If the document is not final revise the plan and resubmit with the generated PRD.
  `

    // Future considerations
    // - Database schema
    // - Tech stack
    // - Testing strategy
    // - Deployment strategy

  // const query = searchParams.get('query')


  try {
    const researchResults = await runWorkflow(prompt);
  
    return Response.json({ message: 'Completed' })
  } catch (error) {
    console.error(error)

    return Response.json({ message: 'Error occurred' })
  }
}