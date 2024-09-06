'use client'

import { experimental_useObject as useObject } from 'ai/react'

import { prdSchema } from '@/generation/schemas'

export default function Home() {
  const { object, submit, isLoading } = useObject({
    api: '/api/docs/gen/prd',
    schema: prdSchema,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const businessCase = e.currentTarget.businessCase.value
    const stakeholderInterviews = e.currentTarget.stakeholderInterviews.value
    const marketResearch = e.currentTarget.marketResearch.value
    const writingStyle = e.currentTarget.writingStyle.value
    const geographicLocation = e.currentTarget.geographicLocation.value

    await submit({
      businessCase,
      stakeholderInterviews,
      marketResearch,
      writingStyle,
      geographicLocation,
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={handleSubmit} className="w-full">
        {/* row */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-lg font-bold text-gray-700">
              Business case
            </label>

            <textarea
              name="businessCase"
              className="w-full h-64 mt-2 p-1 bg-gray-100 rounded-lg"
              placeholder="Enter your business case here"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-700">
              Stakeholder interviews
            </label>

            <textarea
              name="stakeholderInterviews"
              className="w-full h-64 mt-2 p-1 bg-gray-100 rounded-lg"
              placeholder="Enter your stakeholder interviews here"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-700">
              Market research + customer feedback
            </label>

            <textarea
              name="marketResearch"
              className="w-full h-64 mt-2 p-1 bg-gray-100 rounded-lg"
              placeholder="Enter your market research + customer feedback here"
              rows={2}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-8">
          <div>
            <label className="block text-lg font-bold text-gray-700">
              Writing Style
            </label>

            {/* select whether the audience is technical or not */}
            <select
              name="writingStyle"
              className="w-full mt-2 p-1 bg-gray-100 rounded-lg"
            >
              <option value="technical">Technical</option>
              <option value="non-technical">Non-technical</option>
            </select>
          </div>

          {/* geographic location */}
          <div>
            <label className="block text-lg font-bold text-gray-700">
              Geographic location
            </label>

            <input
              name="geographicLocation"
              className="w-full mt-2 p-1 bg-gray-100 rounded-lg"
              placeholder="Enter the geographic location"
            />
          </div>
        </div>

        <button
          type='submit'
          className={`mt-8 p-2 bg-blue-500 text-white rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          Submit
        </button>
      </form>

      {object && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-700">PRD</h2>
            
          <div className="mt-4">
            <h3 className="mt-2 text-md text-gray-700">Objective statement</h3>
            <p className="text-gray-700">{object?.prd?.objectiveStatement}</p>

            <h3 className="mt-2 font-bold text-gray-700">Problem statement</h3>
            <p className="text-gray-700">{object?.prd?.problemStatement}</p>

            <h3 className="mt-2 font-bold text-gray-700">Success metrics</h3>
            <ul>
              {object?.prd?.successMetrics?.map((metric, j) => (
                <li key={j} className="text-gray-700">{metric}</li>
              ))}
            </ul>

            <h4 className="my-2 text-xl font-bold text-gray-700">Personas</h4>
            
            <div className="grid grid-cols-2 gap-4">
              {object?.prd?.personas?.map((persona, j) => persona && (
                <div key={j} className="text-gray-700 border bg-white border-gray-400 p-4 rounded-lg">
                  <h5 className="font-bold">{persona.name}</h5>
                  <p>{persona.description}</p>

                  <h6 className="mt-2 text-bold text-gray-700">Goals</h6>
                  <ul>
                    {persona?.goals?.map((goal, k) => (
                      <li key={k} className="text-gray-700">{goal}</li>
                    ))}
                  </ul>

                  <h6 className="mt-2 text-bold text-gray-700">Pain points</h6>
                  <ul>
                    {persona?.painPoints?.map((painPoint, k) => (
                      <li key={k} className="text-gray-700">{painPoint}</li>
                    ))}
                  </ul>

                  <h6 className="mt-2 text-bold text-gray-700">Jobs to be done</h6>
                  <ul>
                    {persona?.jobToBeDone?.map((job, k) => job && (
                      <li key={k} className="text-gray-700">
                        <h5 className="font-bold">{job.name}</h5>
                        <p>{job.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div>
              {/* assumptions */}
              <h4 className="my-2 text-xl font-bold text-gray-700">Assumptions</h4>

              <div className="grid grid-cols-2 gap-4">
                {object?.prd?.assumptions?.map((assumption, j) => assumption && (
                  <div key={j} className="text-gray-700 border bg-white border-gray-400 p-4 rounded-lg">
                    <h5 className="font-bold text-lg">{assumption.name}</h5>
                    <p>{assumption.description}</p>

                    <div className='grid grid-cols-2 gap-1'>
                      <div>
                        <h6 className="font-bold text-gray-700">Category</h6>
                        <p>{assumption.category}</p>
                      </div>

                      <div>
                        <h6 className="font-bold text-gray-700">Rating</h6>
                        <p>{assumption.rating}</p>
                      </div>
                    </div>

                    <h6 className="mt-2 text-gray-700">Experiments</h6>
                    
                    <div className='grid grid-cols-2 gap-4'>
                      {assumption?.experiments?.map((experiment, k) => experiment && (
                        <div key={k} className="text-gray-700">
                          <h5 className="font-bold">{experiment.name}</h5>
                          <p>{experiment.description}</p>

                          <h6 className="mt-2 text-gray-700">Type</h6>
                          <p>{experiment.type}</p>

                          <h6 className="mt-2 text-gray-700">Success metrics</h6>
                          <ul>
                            {experiment?.successMetrics?.map((metric, l) => (
                              <li key={l} className="text-gray-700">{metric}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
