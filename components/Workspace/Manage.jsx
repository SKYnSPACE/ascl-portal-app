import { useState, Fragment, useEffect } from 'react'
import useSWR from "swr";

import { CalendarIcon, TagIcon, UserIcon } from '@heroicons/react/20/solid'
import {
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

import { format, parseISO } from "date-fns";

import PurchaseRequestPendingModal from './Modals/PurchaseRequestPendingModal';
import PurchaseRequestProcessingModal from './Modals/PurchaseRequestProcessingModal';

import Notification from '../Notification';
// import TripRequestModal from './Modals/TripRequestModal';
// import ReviewCompletedModal from './Modals/ReviewCompletedModal';
// import ReviewDeclinedModal from './Modals/ReviewDeclinedModal';
// import Notification from '../Notification';

const modals = [
  {
    category: 'Purchasing Request',
    items:[
      { id: 28, kind:30, status: 'delayed', name: 'Delayed Purchasing Request', href: '#',},
      { id: 29, kind:30, status: 'declined', name: 'Declined Purchasing Request', href: '#',},
      { id: 30, kind:30, status: 'pending', name: 'Pending Purchasing Request', href: '#', detail: '신규 유저를 생성합니다. 필수 항목들만 입력하며, 나머지 항목(권한, 팀설정, ...)들은 편집화면을 통해 설정합니다.', iconBackground: 'bg-pink-100', iconForeground: 'text-pink-600' },
      { id: 31, kind:30, status: 'processing', name: 'Processing Purchasing Request', href: '#', detail: '기존 유저를 편집/삭제 합니다.', iconBackground: 'bg-yellow-100', iconForeground: 'text-yellow-600' },
      { id: 32, kind:30, status: 'completed', name: 'Completed Purchasing Request', href: '#', detail: '유저들의 직위(권한), 담당업무를 설정합니다.', iconBackground: 'bg-green-100', iconForeground: 'text-green-600' },]
  },
  {
    category: 'Business Trip Request', kind:35,
    items:[
      { id: 33, name: 'Delayed Business Trip Request', href: '#', },
      { id: 34, name: 'Declined Business Trip Request', href: '#', detail: '신규 학기를 생성합니다.', iconBackground: 'bg-pink-100', iconForeground: 'text-pink-600' },
      { id: 35, name: 'Pending Business Trip Request', href: '#', detail: '신규 학기를 생성합니다.', iconBackground: 'bg-pink-100', iconForeground: 'text-pink-600' },
      { id: 36, name: 'Processing Business Trip Request', href: '#', detail: '학기 정보를 편집/삭제 합니다.', iconBackground: 'bg-yellow-100', iconForeground: 'text-yellow-600' },
      { id: 37, name: 'Completed Business Trip Request', href: '#', detail: '시스템 기준학기(현재학기)를 설정합니다.', iconBackground: 'bg-green-100', iconForeground: 'text-green-600' },]
  },
]

const modals_by_category = [
  {
    id: 'pending',
    icon: QuestionMarkCircleIcon,
    name: 'Pending',
    title: 'Press accept or decline. Press outside of the pop-up to withhold your decision.',
    href: '#',
    iconForeground: 'text-sky-700',
    iconBackground: 'bg-sky-50',
  },
  {
    id: 'processing',
    icon: PencilSquareIcon,
    name: 'Processing',
    title: 'Waiting for the next action.',
    href: '#',
    iconForeground: 'text-yellow-700',
    iconBackground: 'bg-yellow-50',
  },
  {
    id: 'completed',
    icon: CheckCircleIcon,
    name: 'Completed',
    title: 'Thank you for your efforts',
    href: '#',
    iconForeground: 'text-green-700',
    iconBackground: 'bg-green-50',
  },
  {
    id: 'delayed',
    icon: ExclamationTriangleIcon,
    name: 'Delayed',
    title: '.',
    href: '#',
    iconForeground: 'text-red-700',
    iconBackground: 'bg-red-50',
  },
  {
    id: 'declined',
    icon: XCircleIcon,
    name: 'Declined',
    title: 'This is the request information you declined.',
    href: '#',
    iconForeground: 'text-red-700',
    iconBackground: 'bg-red-50',
  },
]

const statusStyles = {
  pending: 'bg-sky-100 text-sky-800',
  processing: 'bg-yellow-100 text-yellow-800', //accepted, yet incomplete
  completed: 'bg-green-100 text-green-800',
  delayed: 'bg-red-100 text-red-800',
  declined: 'bg-gray-100 text-gray-800',
}

const Status = {
  '-1': 'declined',
  '0': 'pending',
  '1': 'processing',
  '2': 'completed',
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function parseRequests(requests) {
  const parsedList = requests?.map((request) => {
    switch (request.kind) {
      case 30:
        return {
          id: +`${request.id}`,
          kind: 30,
          icon: BanknotesIcon,
          name: `${request.payload2}`,
          projectAlias: `${request.payload3}`,
          title: `${request.payload4}`,
          category: `${request.payload5}`,
          item: `${request.payload6}`,
          quantity: `${request.payload7}`,
          payMethod: `${request.payload8}`,
          href: '#',
          amount: `${(+request.payload9).toLocaleString()}`,
          details: `${request.payload10}`,
          currency: ' ￦',
          status: Status[`${request.status}`],
          date: `${format(parseISO(request.due), "LLL dd, yyyy")}`,//date: 'July 11, 2020',
          datetime: `${format(parseISO(request.due), "yyyy-MM-dd")}`,//datetime: '2020-07-11',
        };
      case 35:
        return {
          id: +`${request.id}`,
          kind: 35,
          icon: BriefcaseIcon,
          name: `${request.payload2}`,
          projectAlias: `${request.payload3}`,
          title: `${request.payload4}`,
          category: `${request.payload5}`,
          href: '#',
          amount: `${(+request.payload7).toLocaleString()}`,
          currency: ' ￦',
          status: Status[`${request.status}`],
          date: `${format(parseISO(request.due), "LLL dd, yyyy")}`,//date: 'July 11, 2020',
          datetime: `${format(parseISO(request.due), "yyyy-MM-dd")}`,//datetime: '2020-07-11',
        };
    }
  })

  return parsedList;
}

export default function Manage() {
  const [isModalOpen, setIsModalOpen] = useState(0);
  const [isNotify, setIsNotify] = useState(false);
  const [message, setMessage] = useState({ type: 'success', title: 'Confirmed!', details: 'Test message initiated.', });

  const [reviewItems, setReviewItems] = useState([]);

  const { data, error, isLoading } = useSWR(`/api/workspace/manage`);

  const [requests, setRequests] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState({});

  useEffect(() => {
    if (isLoading) return;

    if (data && data.ok) {
      let requests = [];

      const purchaseRequests = parseRequests(data.requests);
      requests.push(purchaseRequests)

      // console.log(requests)

      setRequests(...requests);
    }
  }, [data])

  // useEffect(() => {
  //   // console.log(seminarAlias)
  // }, [seminarAlias])

  // useEffect(() => {
  //   console.log(seminarData?.seminar)
  //   console.log(requestId)
  // }, [seminarData])

  // useEffect(() => {
  //   console.log(requestId)
  // }, [requestId])

  return (
    <div className="px-4">

      <h2 className="text-xl font-medium leading-6 text-gray-900">
        Manage Requests
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        All processing/delayed requests within two months. (Pagination is not supported yet.)
      </p>

      {/* Activity list (smallest breakpoint only) */}
      <div className="mt-4 shadow md:hidden">
        <ul role="list" className="mt-2 divide-y divide-gray-200 overflow-hidden shadow md:hidden">
          {requests?.map((request) => (
            <li key={request.id}>
              <a href={request.href} className="block bg-white px-4 py-4 hover:bg-gray-50"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedRequest(request);
                  setIsModalOpen({kind: +request.kind, status: request.status});
                }}>
                <span className="flex items-center space-x-4">
                  <span className="flex flex-1 grow space-x-2 truncate">
                    <request.icon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <span className="flex flex-col grow truncate text-sm text-gray-500">
                      <span className="truncate">{request.name}</span>
                      <span className="truncate">{request.title}</span>
                      <span>
                        <span className="font-medium text-gray-900">{request.amount}</span>{' '}
                        {request.currency}
                      </span>
                      <time dateTime={request.datetime} className="flex justify-between">{request.date}
                        <span
                          className={classNames(
                            statusStyles[request.status],
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
                          )}
                        >
                          {request.status}
                        </span>
                      </time>
                    </span>
                  </span>
                  <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <nav
          className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3"
          aria-label="Pagination"
        >
          <div className="flex flex-1 justify-between">
            <a
              href="#"
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Previous
            </a>
            <a
              href="#"
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Next
            </a>
          </div>
        </nav>
      </div>

      {/* Activity table (small breakpoint and up) */}
      <div className="mt-4 hidden md:block">
        <div className="mt-2 flex flex-col">
          <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    className="bg-gray-50 px-4 py-3 text-center text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    Request
                  </th>
                  <th
                    className="bg-gray-50 py-3 text-center text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    From
                  </th>

                  <th
                    className="hidden md:block bg-gray-50 px-4 py-3 text-right text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    Amount
                  </th>
                  <th
                    className=" bg-gray-50 px-4 py-3 text-center text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    Status
                  </th>
                  <th
                    className="hidden md:block bg-gray-50 px-4 py-3 text-right text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {requests?.map((request) => (

                  <tr key={request.id} className="bg-white hover:bg-gray-100">
                    <td className="w-full max-w-0 truncate px-4 py-4 text-sm text-gray-500">
                      <a href={request.href} className="group space-x-2 truncate text-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedRequest(request);
                          console.log({kind: +request.kind, status: request.status});
                          setIsModalOpen({kind: +request.kind, status: request.status});
                        }}>

                        <request.icon
                          className="inline h-5 w-5 text-gray-700 group-hover:text-sky-600"
                          aria-hidden="true"
                        />
                        <span className="whitespace-nowrap py-4 text-right text-sm text-gray-900 group-hover:text-sky-600">

                          {request.title}
                        </span>
                      </a>
                    </td>
                    <td className="max-w-xs whitespace-nowrap py-4 text-sm text-gray-900">
                      <div className="flex">
                        <div className="group inline-flex space-x-2 truncate text-sm">

                          <p className="truncate text-gray-500">
                            {request.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="hidden md:block whitespace-nowrap px-4 py-4 text-right text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{request.amount}</span>
                      {request.currency}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                      <span
                        className={classNames(
                          statusStyles[request.status],
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
                        )}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="hidden md:block whitespace-nowrap px-4 py-4 text-right text-sm text-gray-500">
                      <time dateTime={request.datetime}>{request.date}</time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <nav
              className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-4"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                  <span className="font-medium">20</span> results
                </p>
              </div>
              <div className="flex flex-1 justify-between sm:justify-end">
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </a>
                <a
                  href="#"
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>

            <PurchaseRequestPendingModal props={{
        modal: modals[0].items[2], isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage,
        selectedRequest,
      }} />
            <PurchaseRequestProcessingModal props={{
        modal: modals[0].items[3], isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage,
        selectedRequest,
      }} />

      <Notification props={{ message, isNotify, setIsNotify }} />

    </div>
  )
}