import { useEffect, useState } from 'react';
import useSWR from "swr";

import { format, parseISO } from "date-fns";


import { ChatBubbleLeftEllipsisIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import LoadingSpinner from '../LoadingSpinner';

const stats = [
  { name: 'Total Presentations', stat: '4' },
  { name: 'Draft Submission Rate', stat: '75.0%' },
  { name: 'Presentation Ready', stat: '25.0%' },
]

const steps = [
  { id: 1, before: 'No submission', after: 'Draft submitted', href: '#', status: 'complete' },
  { id: 2, before: 'Needs reviewing', after: 'Peer review completed', href: '#', status: 'current' },
  { id: 3, before: 'Under revision', after: 'Ready to present', href: '#', status: 'upcoming' },
]

const presentations = [
  {
    speaker: {
      name: 'Seongheon Lee',
      title: 'Dynamic modeling and control of mechanical systmes using machine learning approaches and their applications to a quadrotor UAV.',
      avatar:
        'https://avatars.githubusercontent.com/u/21105393?v=4',
    },
    currentStage: 4,
  },
  {
    speaker: {
      name: 'Seongheon Lee',
      title: 'Current development stage of the ASCL Portal.',
      avatar:
        'https://avatars.githubusercontent.com/u/21105393?v=4',
    },
    currentStage: 3,
  },
  {
    speaker: {
      name: 'Junwoo Park',
      title: 'Latest development status report on ASCL Navigation system which outperforms DJI, PX4, and even VectorNav VN-300.',
      avatar:
        'https://avatars.githubusercontent.com/u/25346867?v=4',
    },
    currentStage: 2,
  },
  {
    speaker: {
      name: 'Kyungwoo Hong',
      title: 'TBD',
      avatar:
        'https://avatars.githubusercontent.com/u/25144685?v=4',
    },
    currentStage: 1,
  },
]

function getInitials(name) {
  const fullName = name?.toString().split(' ');
  if (!fullName) return '^^';

  const initials = [fullName[0].charAt(0), fullName[1].charAt(0)];
  return initials.join('');
}


export default function Progress() {
  const { data, error, isLoading, mutate } = useSWR(`/api/seminar/progress`);
  const [presentations, setPresentations] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    if (data?.presenters) {
      let presentations = ([]);
      data?.presenters.map((presenter) => {
        presentations.push({
          speaker: { id: presenter.id, name: presenter.name, title: presenter.presentedSeminars[0]?.title, avatar: presenter.avatar }, currentStage: presenter.presentedSeminars[0]?.currentStage,
          waiver: presenter.presentedSeminars[0]?.waiver, skipReview: presenter.presentedSeminars[0]?.skipReview, skipRevision: presenter.presentedSeminars[0]?.skipRevision
        })
      });
      setPresentations(presentations);
    }
    if (data?.progresses) {
      data?.progresses?.find((item) => item.stage == 2)
      const presenterCounts = data?.presenters?.length;
      const draftSubmittedCounts = ((data?.progresses?.find((item) => item.stage == 2)?.count || 0)
        + (data?.progresses?.find((item) => item.stage == 3)?.count || 0)
        + (data?.progresses?.find((item) => item.stage == 4)?.count || 0)
        + (data?.progresses?.find((item) => item.stage == 5)?.count || 0));
      const presentationReadyCounts = data?.progresses?.find((item) => item.stage == 5)?.count || 0;

      const draftSubmissionRate = presenterCounts ? draftSubmittedCounts / presenterCounts : 0;
      const presentationreadyRate = presenterCounts ? presentationReadyCounts / presenterCounts : 0;

      const stats = ([
        { name: 'Total Presentations', stat: presenterCounts },
        { name: 'Draft Submission Rate', stat: `${(draftSubmissionRate * 100).toFixed(1)} %` },
        { name: 'Presentation Ready', stat: `${(presentationreadyRate * 100).toFixed(1)} %` },
      ]);
      setStats(stats);
    }
  }, [data]);


  return (
    <div>

      <div className="relative z-10 pb-4">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-4xl lg:pr-24">
          <h3 className="font-display text-xl text-center font-medium tracking-tighter text-sky-600 sm:text-xl">
            2022 - Winter
          </h3>
          <h2 className="font-display text-3xl text-center font-medium tracking-tighter text-gray-800 sm:text-3xl">
            Lab. Seminar Progress
          </h2>
          <p className="my-2 font-display text-m tracking-tight text-gray-600">
            Step 1. Draft submission<br />
            Step 2. Peer review<br />
            Step 3. Finalize
          </p>
        </div>
      </div>

      {stats && stats.length > 0 ?
        <div className="mb-4">
          <h3 className="mb-1 text-lg font-medium leading-6 text-gray-900">Summary</h3>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-sky-600">{item.stat}</dd>
              </div>
            ))}
          </dl>
        </div> : <></>}

      <h3 className="mb-1 text-lg font-medium leading-6 text-gray-900">Details</h3>

      {isLoading ?
        <div className="flex items-center justify-center my-16">
          <LoadingSpinner className="h-16 w-16 text-sky-500" />
        </div> :
        <div className="overflow-hidden bg-white shadow sm:rounded-md">

          <ul role="list" className="divide-y divide-gray-200">
            {presentations.map((presentation) => (
              <li key={presentation.speaker.id}>
                <a href={presentation.href} className="block hover:bg-gray-50">
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex-shrink-0">

                        <div className="m-1 w-12 h-12 relative flex justify-center items-center rounded-full bg-gray-400 text-xl text-white">

                          {presentation.speaker.avatar ? <img className="rounded-full" src={presentation.speaker.avatar} alt="" />
                            : <span>{getInitials(presentation.speaker.name)}</span>}
                        </div>

                        {/* <img className="h-12 w-12 rounded-full" src={presentation.speaker.avatar} alt="" /> */}
                      </div>


                      <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-5 md:gap-4">

                        <div className="md:col-span-2">
                          <p className="truncate text-sm font-medium text-sky-600">{presentation.speaker.name}</p>
                          <div className="my-2 flex items-start text-sm text-gray-500">
                            <ChatBubbleLeftEllipsisIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                            <span className="whitespace-normal">{presentation.speaker.title}</span>
                          </div>
                        </div>

                        {/* <div className="hidden md:block"> */}
                        {/* <div className="md:block">
                      <div>
                        <p className="text-sm text-gray-900">
                          Applied on <time dateTime={presentation.date}>{presentation.dateFull}</time>
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                          <CheckCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400" aria-hidden="true" />
                          {presentation.stage}
                        </p>
                      </div>
                    </div> */}
                        <nav className="md:col-span-3" aria-label="Progress">
                          <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
                            {steps.map((step) => (
                              <li key={step.id} className="md:flex-1">
                                {presentation.currentStage > step.id ? (
                                  <div
                                    className="group flex flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
                                  >
                                    <span className="text-sm font-medium text-sky-600 ">Step {step.id}</span>
                                    <span className="text-sm font-medium">{step.after}</span>
                                    <div className="flex-grow">
                                      {presentation.waiver ? <span className="bg-red-100 text-red-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">WITHDRAWN</span> : <></>}
                                    </div>
                                    <div className="flex-grow">
                                      {step.id == 2 && presentation.skipReview ? <span className="bg-yellow-100 text-yellow-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">Review X</span> : <></>}
                                    </div>
                                    <div className="flex-grow">
                                      {step.id == 3 && presentation.skipRevision ? <span className="bg-yellow-100 text-yellow-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">Revision X</span> : <></>}
                                    </div>

                                  </div>
                                ) : presentation.currentStage == step.id ? (
                                  <div
                                    className="flex flex-col border-l-4 border-blue-200 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
                                    aria-current="step"
                                  >
                                    <span className="text-sm font-medium text-blue-200">Step {step.id}</span>
                                    <span className="text-sm font-sm text-gray-500">{step.before}</span>
                                    <div className="flex-grow">
                                      {presentation.waiver ? <span className="bg-red-100 text-red-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">WITHDRAWN</span> : <></>}
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
                                  >
                                    <span className="text-sm font-medium text-gray-400">Step {step.id}</span>
                                    <span className="text-sm font-medium">{ }</span>
                                    <div className="flex-grow">
                                      {presentation.waiver ? <span className="bg-red-100 text-red-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">WITHDRAWN</span> : <></>}
                                    </div>
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
        </div>}
    </div>
  )
}