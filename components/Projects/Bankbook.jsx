import { useState, useEffect } from "react";
import useSWR from "swr";

import { format, differenceInDays, parseISO } from "date-fns";

import { BanknotesIcon, CpuChipIcon, GlobeAltIcon, PaperClipIcon, Square3Stack3DIcon, TruckIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Page403 from "../Page403";
import LoadingSpinner from "../LoadingSpinner";


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Bankbook({ props }) {
  const { alias } = { ...props };
  const { data, mutate, error, isLoading } = useSWR(alias ? `/api/project/${alias}` : null);

  // useEffect(() => { console.log(data) }, [data])

  const daysLeft = differenceInDays(parseISO(data?.selectedProject?.endDate), new Date());
  const projectPeriod = differenceInDays(parseISO(data?.selectedProject?.endDate), parseISO(data?.selectedProject?.startDate));
  const remainingRate = daysLeft / projectPeriod;
  const elapsedRate = 1 - remainingRate;

  const cards = [
    { name: '재료비 잔액', href: '#', icon: Square3Stack3DIcon, amount: data?.selectedProject?.mpeBalance?.toLocaleString() },
    { name: '전산처리비 잔액', href: '#', icon: CpuChipIcon, amount: data?.selectedProject?.cpeBalance?.toLocaleString() },
    { name: '국내출장비 잔액', href: '#', icon: TruckIcon, amount: data?.selectedProject?.dteBalance?.toLocaleString() },
    { name: '해외출장비 잔액', href: '#', icon: GlobeAltIcon, amount: data?.selectedProject?.oteBalance?.toLocaleString() },
    { name: '회의비 잔액', href: '#', icon: UserGroupIcon, amount: data?.selectedProject?.meBalance?.toLocaleString() },
    { name: '수용비 잔액', href: '#', icon: BanknotesIcon, amount: data?.selectedProject?.aeBalance?.toLocaleString() },
    // More items...
  ]

  return (

    <div className="lg:flex lg:h-full lg:flex-col">

      {isLoading || !data ?
        <div className="flex items-center justify-center my-16">
          <LoadingSpinner className="h-16 w-16 text-sky-500" />
        </div> :
        <>
          {/* Project summary */}
          {data?.selectedProject ?
            <div className="space-y-4 sm:px-6 lg:col-span-9 lg:px-0">
              <div className="relative">
                <h3 className="text-lg font-medium leading-6 text-gray-900">[{data?.selectedProject?.alias}] {data?.selectedProject?.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{data?.selectedProject?.startDate} ~ {data?.selectedProject?.endDate}</p>

                <div className="hidden sm:inline absolute top-0 right-0">
                  <span className={classNames(
                    remainingRate > 0.3 ?
                      "bg-sky-100 text-sky-800" : remainingRate > 0.1 ?
                        "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800",
                    "inline-flex items-center rounded-md px-2 py-2 text-xl font-bold")}>
                    {daysLeft < 0 ? `D+${-daysLeft}` : `D-${daysLeft}`}
                  </span>
                </div>

                {/* <div className="w-full bg-gray-200 rounded-full">
                <div className="bg-blue-600 text-xs font-sm text-blue-100 text-center p-0.5 leading-none rounded-full"
                style={{ width: `${100*elapsedRate}%` }}> {(100*elapsedRate).toFixed(0)}%</div>
              </div> */}

              </div>

              <div className="mt-5 border-y border-gray-200">
                <dl className="divide-y divide-gray-200">
                  <div className="py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Working group</dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-3 sm:mt-0">
                      <span className="flex-grow">
                        {`${data?.selectedProject?.managers?.sort((firstItem, secondItem) => firstItem.user.userNumber - secondItem.user.userNumber).map((manager) => manager.user.name).join('*, ')}*,
                    ${data?.selectedProject?.staffs?.sort((firstItem, secondItem) => firstItem.user.userNumber - secondItem.user.userNumber).map((staff) => staff.user.name).join(', ')}`}

                      </span>

                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Participating</dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-3 sm:mt-0">
                      <span className="flex-grow">
                        {`${data?.selectedProject?.participants?.sort((firstItem, secondItem) => firstItem.user.userNumber - secondItem.user.userNumber).map((participant) => participant.user.name).join(', ')}`}
                      </span>

                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Note</dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-3 sm:mt-0">
                      <span className="flex-grow whitespace-pre-wrap">
                        {data?.selectedProject?.note}
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
                            <span className="ml-2 w-0 flex-1 truncate">[{data?.selectedProject?.alias}] Proposal.zip</span>
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


              <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Card */}
                {cards.map((card) => (
                  <div key={card.name} className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <card.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="truncate text-sm font-medium text-gray-500">{card.name}</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">&#8361;{card.amount}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm text-center">
                        <a href={card.href} className="font-medium text-cyan-700 hover:text-cyan-900">
                          View all
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>


            </div> :
            <> <Page403 />
              <p className="mb-20 text-gray-500 text-center">(You were trying to enter {alias})</p>
            </>
          }
        </>}
    </div>

  )
}