import { useState, useEffect } from "react";
import useSWR from "swr";

import { format, differenceInDays, parseISO } from "date-fns";

import { CheckIcon, PaperClipIcon } from '@heroicons/react/24/outline';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Bankbook({ props }) {
  const { alias } = { ...props };
  const { data, mutate, error, isLoading } = useSWR(alias ? `/api/project/${alias}` : null);

  useEffect(() => { console.log(data) }, [data])

  return (

    <div className="lg:flex lg:h-full lg:flex-col">

      {/* Project summary */}
      {data?.projectInfo ?
        <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
          <section aria-labelledby="payment-details-heading">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">[{data?.projectInfo?.alias}] {data?.projectInfo?.title}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{data?.projectInfo?.startDate} ~ {data?.projectInfo?.endDate}</p>
            </div>
            <div className="mt-5 border-t border-gray-200">
              <dl className="divide-y divide-gray-200">
                <div className="py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:py-3">
                  <dt className="text-sm font-medium text-gray-500">Working group</dt>
                  <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-3 sm:mt-0">
                    <span className="flex-grow">
                    {`${data?.projectInfo?.managers?.sort((firstItem, secondItem) => firstItem.user.userNumber - secondItem.user.userNumber).map((manager) => manager.user.name).join('*, ')}*,
                    ${data?.projectInfo?.staffs?.sort((firstItem, secondItem) => firstItem.user.userNumber - secondItem.user.userNumber).map((staff) => staff.user.name).join(', ')}`}

                    </span>

                  </dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:py-3">
                  <dt className="text-sm font-medium text-gray-500">Participating</dt>
                  <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-3 sm:mt-0">
                    <span className="flex-grow">
                    {`${data?.projectInfo?.participants?.sort((firstItem, secondItem) => firstItem.user.userNumber - secondItem.user.userNumber).map((participant) => participant.user.name).join(', ')}`}
                    </span>

                  </dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:py-3">
                  <dt className="text-sm font-medium text-gray-500">Note</dt>
                  <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-3 sm:mt-0">
                    <span className="flex-grow whitespace-pre-wrap">
                    {data?.projectInfo?.note}
                    </span>

                  </dd>
                </div>
                
                <div className="py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:py-3">
                  <dt className="text-sm font-medium text-gray-500">Attachment</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">
                    <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                      <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                        <div className="flex w-0 flex-1 items-center">
                          <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                          <span className="ml-2 w-0 flex-1 truncate">[{data?.projectInfo?.alias}] Proposal.zip</span>
                        </div>
                        <div className="ml-4 flex flex-shrink-0 space-x-4">
                          <button
                            type="button"
                            className="rounded-md bg-white font-medium text-sky-600 hover:text-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                          >
                            Download
                          </button>
                        </div>
                      </li>
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>

          </section>



        </div> : <></>}

    </div>

  )
}