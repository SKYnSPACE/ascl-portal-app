import { ChatBubbleLeftEllipsisIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

const topics = [
  {
    speaker: {
      name: 'Seongheon Lee',
      title: 'Dynamic modeling and control of mechanical systmes using machine learning approaches and their applications to a quadrotor UAV.',
      imageUrl:
        'https://avatars.githubusercontent.com/u/21105393?v=4',
    },
    currentStage: 4,
  },
  {
    speaker: {
      name: 'Seongheon Lee',
      title: 'Current development stage of the ASCL Portal.',
      imageUrl:
        'https://avatars.githubusercontent.com/u/21105393?v=4',
    },
    currentStage: 3,
  },
  {
    speaker: {
      name: 'Junwoo Park',
      title: 'Latest development status report on ASCL Navigation system which outperforms DJI, PX4, and even VectorNav VN-300.',
      imageUrl:
        'https://avatars.githubusercontent.com/u/25346867?v=4',
    },
    currentStage: 2,
  },
  {
    speaker: {
      name: 'Kyungwoo Hong',
      title: 'TBD',
      imageUrl:
        'https://avatars.githubusercontent.com/u/25144685?v=4',
    },
    currentStage: 1,
  },
]

const steps = [
  { id: 1, before: 'No submission', after: 'Draft submitted', href: '#', status: 'complete' },
  { id: 2, before: 'Needs reviewing', after: 'Peer review completed', href: '#', status: 'current' },
  { id: 3, before: 'Under revision', after: 'Ready to present', href: '#', status: 'upcoming' },
]

export default function Progress() {
  return (
    <div>
      <div className="relative z-10 pb-4">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-4xl lg:pr-24">
          <h2 className="font-display text-3xl font-medium tracking-tighter text-gray-900 sm:text-3xl">
            2022 겨울 랩세미나 준비 현황
          </h2>
          <p className="mt-4 font-display text-lg tracking-tight text-gray-700">
            자료제출 -- 리뷰 -- 최종검토
          </p>
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {topics.map((topic) => (
            <li key={topic.speaker.title}>
              <a href={topic.href} className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="flex min-w-0 flex-1 items-center">
                    <div className="flex-shrink-0">
                      <img className="h-12 w-12 rounded-full" src={topic.speaker.imageUrl} alt="" />
                    </div>


                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-5 md:gap-4">

                      <div className="md:col-span-2">
                        <p className="truncate text-sm font-medium text-cyan-600">{topic.speaker.name}</p>
                        <div className="my-2 flex items-start text-sm text-gray-500">
                          <ChatBubbleLeftEllipsisIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                          <span className="whitespace-normal">{topic.speaker.title}</span>
                        </div>
                      </div>

                      {/* <div className="hidden md:block"> */}
                      {/* <div className="md:block">
                      <div>
                        <p className="text-sm text-gray-900">
                          Applied on <time dateTime={topic.date}>{topic.dateFull}</time>
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                          <CheckCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400" aria-hidden="true" />
                          {topic.stage}
                        </p>
                      </div>
                    </div> */}
                      <nav className="md:col-span-3" aria-label="Progress">
                        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
                          {steps.map((step) => (
                            <li key={step.name} className="md:flex-1">
                              {topic.currentStage > step.id ? (
                                <div
                                  className="group flex flex-col border-l-4 border-cyan-600 py-2 pl-4 hover:border-cyan-800 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
                                >
                                  <span className="text-sm font-medium text-cyan-600 group-hover:text-cyan-800">Step {step.id}</span>
                                  <span className="text-sm font-medium">{step.after}</span>
                                </div>
                              ) : topic.currentStage == step.id ? (
                                <div
                                  className="flex flex-col border-l-4 border-blue-200 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
                                  aria-current="step"
                                >
                                  <span className="text-sm font-medium text-blue-200">Step {step.id}</span>
                                  <span className="text-sm font-sm text-gray-500">{step.before}</span>
                                </div>
                              ) : (
                                <div
                                  className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
                                >
                                  <span className="text-sm font-medium text-gray-400 group-hover:text-gray-700">Step {step.id}</span>
                                  <span className="text-sm font-medium">{ }</span>
                                </div>
                              )}
                            </li>
                          ))}
                        </ol>
                      </nav>

                    </div>

                  </div>


                  <div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}