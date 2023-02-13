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

import { format, differenceInSeconds, parseISO } from "date-fns";

// import TripRequestModal from './Modals/TripRequestModal';
import Notification from '../Notification';

import { classNames } from '../../libs/frontend/utils'
// import TripActionProceedModal from './Modals/BusinessTrip/TripActionProceedModal';
// import TripRequestPendingModal from './Modals/BusinessTrip/TripRequestPendingModal';

const modals = [
  {
    category: 'Purchasing Request',
    items: [
      { id: 28, kind: 30, status: 'delayed', name: 'Delayed Purchasing Request', href: '#', },
      { id: 29, kind: 30, status: 'declined', name: 'Declined Purchasing Request', href: '#', },
      { id: 30, kind: 30, status: 'pending', name: 'Pending Purchasing Request', href: '#', iconBackground: 'bg-pink-100', iconForeground: 'text-pink-600' },
      { id: 31, kind: 30, status: 'processing', name: 'Processing Purchasing Request', href: '#', iconBackground: 'bg-yellow-100', iconForeground: 'text-yellow-600' },
      { id: 32, kind: 30, status: 'completed', name: 'Completed Purchasing Request', href: '#', iconBackground: 'bg-green-100', iconForeground: 'text-green-600' },]
  },
  {
    category: 'Business Trip Request',
    items: [
      { id: 33, kind: 35, status: 'delayed', name: 'Delayed Business Trip Request', href: '#', },
      { id: 34, kind: 35, status: 'declined', name: 'Declined Business Trip Request', href: '#', iconBackground: 'bg-pink-100', iconForeground: 'text-pink-600' },
      { id: 35, kind: 35, status: 'pending', name: 'Pending Business Trip Request', href: '#', iconBackground: 'bg-pink-100', iconForeground: 'text-pink-600' },
      { id: 36, kind: 35, status: 'processing', name: 'Processing Business Trip Request', href: '#', iconBackground: 'bg-yellow-100', iconForeground: 'text-yellow-600' },
      { id: 37, kind: 35, status: 'completed', name: 'Completed Business Trip Request', href: '#', iconBackground: 'bg-green-100', iconForeground: 'text-green-600' },]
  },
  {
    category: 'Purchasing Action',
    items: [
      { id: 298, kind: 300, status: 'delayed', name: 'Delayed Purchasing Action', href: '#', },
      { id: 299, kind: 300, status: 'declined', name: 'Declined Purchasing Action', href: '#', },
      { id: 300, kind: 300, status: 'pending', name: 'Pending Purchasing Action', href: '#', iconBackground: 'bg-pink-100', iconForeground: 'text-pink-600' },
      { id: 301, kind: 300, status: 'processing', name: 'Processing Purchasing Action', href: '#', iconBackground: 'bg-yellow-100', iconForeground: 'text-yellow-600' },
      { id: 302, kind: 300, status: 'completed', name: 'Completed Purchasing Action', href: '#', iconBackground: 'bg-green-100', iconForeground: 'text-green-600' },]
  },
  {
    category: 'Business Trip Action',
    items: [
      { id: 298, kind: 350, status: 'delayed', name: 'Delayed Business Trip Action', href: '#', },
      { id: 299, kind: 350, status: 'declined', name: 'Declined Business Trip Action', href: '#', },
      { id: 300, kind: 350, status: 'pending', name: 'Pending Business Trip Action', href: '#', iconBackground: 'bg-pink-100', iconForeground: 'text-pink-600' },
      { id: 301, kind: 350, status: 'processing', name: 'Processing Business Trip Action', href: '#', iconBackground: 'bg-yellow-100', iconForeground: 'text-yellow-600' },
      { id: 302, kind: 350, status: 'completed', name: 'Completed Business Trip Action', href: '#', iconBackground: 'bg-green-100', iconForeground: 'text-green-600' },]
  },
]

const trips = [
  {
    category: 'Delayed (Overdue actions will be withdrawn automatically)', //기한지남(증빙안됨): TODO(E-MAIL), 완료 권한은 김은영선생님께?
    lists: [
      { account: '임철수', category: 'KFC', item: 0, method: '카드', proposed: '2022-11-30', due: '2022-12-15' },
      { account: '임철수', category: '프린트박스', item: 0, method: '카드', proposed: '2022-11-30', due: '2022-12-15' },
    ],
  },
  {
    category: 'Pending (Make a trip action)', //계정문의 대기중
    lists: [
      { account: '임철수', category: '청소기', item: 0, method: '계산서', proposed: '2022-12-12', due: '2022-12-31' },
      { account: '임철수', category: '파파존스', item: 0, method: '카드', proposed: '2022-12-12', due: '2022-12-31' },
    ],
  },
  {
    category: 'Processing (Please submit the reference documents)', //구매절차 진행중
    lists: [
      { account: '임철수', category: 'VN-300', item: 0, method: '계산서', proposed: '2022-12-12', due: '2022-12-31' },
      { account: '임철수', category: '파파존스', item: 0, method: '계산서', proposed: '2022-12-12', due: '2022-12-31' },
    ],
  },
  {
    category: 'Completed', //기한지남(증빙안됨): TODO(E-MAIL), 완료 권한은 김은영선생님께?
    lists: [
      { account: '임철수', category: 'KFC', item: 0, method: '카드', proposed: '2022-11-30', due: '2022-12-15' },
      { account: '임철수', category: '프린트박스', item: 0, method: '카드', proposed: '2022-11-30', due: '2022-12-15' },
    ],
  },
]

const statusStyles = {
  pending: 'bg-sky-100 text-sky-800',
  processing: 'bg-yellow-100 text-yellow-800', //accepted, yet incomplete
  completed: 'bg-green-100 text-green-800',
  delayed: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
}

const Status = {
  '-1': 'withdrawn',
  '0': 'pending',
  '1': 'processing',
  '2': 'completed',
}

const PayMethods = {
  C: "카드",
  T: "계산서",
  P: "구매팀",
}
const Categories = {
  MPE: "재료비",
  CPE: "전산처리비",
  DTE: "국내출장비",
  OTE: "해외출장비",
  ME: "회의비",
  AE: "수용비",
  NS: "지정요망",
}

function parseActions(actions) {
  const parsedList = actions?.map((action) => {
    return {
      id: +action.id,
      kind: 350,
      icon: BriefcaseIcon,
      name: `${action.payload2}`,
      projectAlias: `${action.payload3}`,
      title: `${action.payload4}`,
      category: `${action.payload5}`,
      destination: `${action.payload6}`,
      expense: `${(+action.payload7).toLocaleString()}`,
      startDate: `${action.payload8}`,
      endDate: `${action.payload9}`,
      href: '#',
      details: `${action.payload10}`,
      currency: ' ￦',
      status: Status[`${action.status}`],
      date: `${format(parseISO(action.due), "LLL dd, yyyy")}`,//date: 'July 11, 2020',
      datetime: action.due, //datetime: '2020-07-11',
    };
  })

  return parsedList;
}


function parseRequests(requests) {
  const parsedList = requests?.map((request) => {
    return {
      id: +`${request.id}`,
      kind: 35,
      icon: BriefcaseIcon,
      name: `${request.payload2}`,
      requestFor: `${request.requestedFor.name}`,
      projectAlias: `${request.payload3}`,
      title: `${request.payload4}`,
      category: `${request.payload5}`,
      destination: `${request.payload6}`,
      expense: `${(+request.payload7).toLocaleString()}`,
      startDate: `${request.payload8}`,
      endDate: `${request.payload9}`,
      href: '#',
      details: `${request.payload10}`,
      message: `${request.payload11}`,
      currency: ' ￦',
      status: Status[`${request.status}`],
      date: `${format(parseISO(request.due), "LLL dd, yyyy")}`,//date: 'July 11, 2020',
      datetime: request.due, //datetime: '2020-07-11',
    };
  })

  return parsedList;
}

export default function BusinessTrip() {
  const [isModalOpen, setIsModalOpen] = useState(0);
  const [isNotify, setIsNotify] = useState(false);
  const [message, setMessage] = useState({ type: 'success', title: 'Confirmed!', details: 'Test message initiated.', });


  const { data, error, isLoading } = useSWR(`/api/workspace/businessTrip`);

  const [actions, setActions] = useState([]);
  const [trips, setTrips] = useState([]);
  const [requests, setRequests] = useState([]);

  const [selectedAction, setSelectedAction] = useState({});
  const [selectedRequest, setSelectedRequest] = useState({});



  useEffect(() => {
    if (isLoading) return;

    if (data && data.ok) {
      let trips = [];
      const tripActions = parseActions(data.myTripActions);


      trips.push(
        {
          category: 'Delayed (Overdue actions will be withdrawn automatically)', //기한지남(증빙안됨): TODO(E-MAIL), 완료 권한은 김은영선생님께?
          status: 'delayed',
          lists: tripActions.filter(action => (action.status == 'pending' || action.status == 'processing') && differenceInSeconds(parseISO(action.datetime), new Date()) < 0)
        },
      )
      trips.push(
        {
          category: 'Pending (Make a trip action)', //결제 대기중
          status: 'pending',
          lists: tripActions.filter(action => action.status == 'pending')
        },
      )
      trips.push(
        {
          category: 'Processing (Please submit the reference documents)', //결제완료. 서류처리중
          status: 'processing',
          lists: tripActions.filter(action => action.status == 'processing')
        },
      )
      trips.push(
        {
          category: 'Completed',
          status: 'completed',
          lists: tripActions.filter(action => action.status == 'completed')
        },
      )
      trips.push(
        {
          category: 'Withdrawn',
          status: 'withdrawn',
          lists: tripActions.filter(action => action.status == 'withdrawn')
        },
      )

      setActions(tripActions);
      setTrips(trips);

      let requests = [];

      const tripRequests = parseRequests(data.myTripRequests);
      requests.push(tripRequests)

      // console.log(requests)

      setRequests(...requests);
    }
  }, [data])

  return (<>
    <div className="px-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">My Business Trips</h1>
          <p className="mt-2 text-sm text-gray-700">
            My business trips within two months. (Pagination is not supported yet.)
          </p>
        </div>
        {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#2980b9] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-[#2980b9] focus:ring-offset-2 sm:w-auto"
          >
            Add Item
          </button>
        </div> */}
      </div>


      {/* Activity list (smallest breakpoint only) */}
      <div className="mt-4 shadow md:hidden">
        <ul role="list" className="mt-2 divide-y divide-gray-200 overflow-hidden shadow md:hidden">
          {actions?.map((action) => (
            <li key={action.id}>
              <a href={action.href} className="block bg-white px-4 py-4 hover:bg-gray-50"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedAction(action);
                  setIsModalOpen({ kind: +action.kind, status: action.status });
                }}>
                <span className="flex items-center space-x-4">
                  <span className="flex flex-1 grow space-x-2 truncate">
                    <action.icon className="h-5 w-5 flex-shrink-0 text-gray-900" aria-hidden="true" />
                    <span className="flex flex-col grow truncate text-sm text-gray-500">
                      <span className="truncate text-gray-900">{action.destination} [{action.startDate} ~ {action.endDate}]</span>
                      <span className="truncate">{action.title} / {Categories[action.category]}</span>
                      <span>
                        <span className="font-medium text-gray-900">{action.expense}</span>{' '}
                        {action.currency} 
                      </span>
                      <time dateTime={action.datetime} className="flex justify-between">{action.date}

                        {((action.status == 'pending' || action.status == 'processing') && differenceInSeconds(parseISO(action.datetime), new Date()) < 0) ?
                          <span
                            className={classNames(
                              statusStyles['delayed'],
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
                            )}
                          >
                            delayed
                          </span>
                          :
                          <span
                            className={classNames(
                              statusStyles[action.status],
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
                            )}
                          >
                            {action.status}
                          </span>}
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




      <div className="mt-4 hidden md:block">
        <div className="mt-2 flex flex-col">
          <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow border rounded-lg ">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="bg-gray-50 px-4 py-3 text-center text-sm font-semibold text-gray-900"
                    scope="col">
                    Period
                  </th>
                  <th className="bg-gray-50 py-3 text-center text-sm font-semibold text-gray-900"
                    scope="col">
                    DST
                  </th>
                  <th className="hidden xl:block bg-gray-50 py-3 text-center text-sm font-semibold text-gray-900"
                    scope="col"
                  >                    Category
                  </th>
                  <th className="bg-gray-50 py-3 text-center text-sm font-semibold text-gray-900"
                    scope="col">
                    Account
                  </th>
                  <th className="hidden xl:block bg-gray-50 py-3 text-center text-sm font-semibold text-gray-900"
                    scope="col">
                    Amount
                  </th>
                  <th className="bg-gray-50 py-3 text-center text-sm font-semibold text-gray-900"
                    scope="col">
                    Due
                  </th>
                  <th className="bg-gray-50 px-4 py-3 text-right text-sm font-semibold text-gray-900"
                    scope="col">
                  </th>

                </tr>
              </thead>
              {trips.length != 0 ?
                <tbody className="bg-white">
                  {trips?.map((actions) => (


                    <Fragment key={actions.category}>
                      {
                        actions.lists.length != 0 ?
                          <tr className="border-t border-gray-200">
                            <th
                              colSpan={7}
                              scope="colgroup"
                              className={classNames(
                                statusStyles[actions.status],
                                "bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-gray-900")}
                            >
                              {actions.category}
                            </th>
                          </tr> : <tr></tr>}

                      {
                        actions.lists.length != 0 ?
                          actions.lists.map((action, itemIdx) => (
                            <tr
                              key={action.id}
                              className={classNames(itemIdx === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}
                            >
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {action.startDate} ~ {action.endDate}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                {action.destination}
                                </td>
                              <td className="hidden xl:block whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {Categories[action.category]}
                              </td>
                              <td className="w-full max-w-[200px] truncate whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {action.title}
                                </td>
                              <td className="hidden xl:block  whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <span className="font-medium text-gray-900">{action.amount}</span>
                                {action.expense}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{action.date}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-center text-sky-500 hover:text-sky-700">
                                {action.status == 'pending' ?
                                  <a href={action.href} className=""
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedAction(action);
                                      setIsModalOpen({ kind: +action.kind, status: action.status });
                                    }}>
                                    Proceed
                                  </a> : <></>}
                              </td>
                            </tr>
                          ))
                          :
                          <tr>
                          </tr>
                      }

                    </Fragment>

                  ))}
                </tbody> : <></>}
            </table>
          </div>
        </div>

      </div>
    </div>


    <div className="px-4 mt-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Pending Requests</h1>
          <p className="mt-2 text-sm text-gray-700">
            Business Trip requests still pending.
          </p>
        </div>
        {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#2980b9] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-[#2980b9] focus:ring-offset-2 sm:w-auto"
          >
            Add Item
          </button>
        </div> */}
      </div>


      {/* Activity list (smallest breakpoint only) */}
      <div className="mt-4 shadow md:hidden">
        <ul role="list" className="mt-2 divide-y divide-gray-200 overflow-hidden shadow md:hidden">
          {requests?.map((request) => (
            <li key={request.id}>
              <a href={request.href} className="block bg-white px-4 py-4 hover:bg-gray-50"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedRequest(request);
                  // if ((request.status == 'pending' || request.status == 'processing') && differenceInSeconds(parseISO(request.datetime), new Date()) < 0 )
                  // setIsModalOpen({ kind: +request.kind, status: 'delayed' });
                  // else
                  setIsModalOpen({ kind: +request.kind, status: request.status });
                }}>
                <span className="flex items-center space-x-4">
                  <span className="flex flex-1 grow space-x-2 truncate">
                    <request.icon className="h-5 w-5 flex-shrink-0 text-gray-900" aria-hidden="true" />
                    <span className="flex flex-col grow truncate text-sm text-gray-500">
                      <span className="truncate text-gray-900">{request.destination} [{request.startDate} ~ {request.endDate}]</span>
                      <span className="truncate">{request.title} / {Categories[request.category]}</span>
                      <span>
                        <span className="font-medium text-gray-900">{request.expense}</span>{' '}
                        {request.currency} 
                      </span>
                      <span className="truncate">Request To: {request.requestFor}</span>
                      <time dateTime={request.datetime} className="flex justify-between">{request.date}

                        {((request.status == 'pending' || request.status == 'processing') && differenceInSeconds(parseISO(request.datetime), new Date()) < 0) ?
                          <span
                            className={classNames(
                              statusStyles['delayed'],
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
                            )}
                          >
                            delayed
                          </span>
                          :
                          <span
                            className={classNames(
                              statusStyles[request.status],
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
                            )}
                          >
                            {request.status}
                          </span>}
                      </time>
                    </span>
                  </span>
                  <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 hidden md:block">
        <div className="mt-2 flex flex-col">
          <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow border rounded-lg ">
            <table className="min-w-full">
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
                    To
                  </th>
                  <th
                    className="bg-gray-50 px-4 py-3 text-right text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    Starts
                  </th>
                  <th
                    className=" bg-gray-50 px-4 py-3 text-right text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    Ends
                  </th>
                  <th
                    className=" bg-gray-50 px-4 py-3 text-center text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    DST
                  </th>

                  <th
                    className=" bg-gray-50 px-4 py-3 text-right text-sm font-semibold text-gray-900"
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
                          setIsModalOpen({ kind: +request.kind, status: request.status });
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
                            {request.requestFor}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-gray-500">
                      <span className="text-sm text-gray-900">{request.startDate}</span>
                    </td>
                    <td className=" whitespace-nowrap px-4 py-4 text-right text-sm text-gray-500">
                      <span className="text-sm text-gray-900">{request.endDate}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{request.destination}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-gray-500">
                      <time dateTime={request.datetime}>{request.date}</time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

    {/* <TripActionProceedModal props={{
      modal: modals[2].items[2], isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage,
      selectedAction,
    }} />
    <TripRequestPendingModal props={{
      modal: modals[0].items[2], isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage,
      selectedRequest,
    }} /> */}

    <Notification props={{ message, isNotify, setIsNotify }} />
  </>
  )
}