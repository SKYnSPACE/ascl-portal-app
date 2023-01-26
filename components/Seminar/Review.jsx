import { useState, Fragment, useEffect } from 'react'
import useSWR from "swr";

import { CalendarIcon, TagIcon, UserIcon } from '@heroicons/react/20/solid'
import {
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  CreditCardIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

import { format, parseISO } from "date-fns";

import ReviewPendingModal from './Modals/ReviewPendingModal';
import ReviewAcceptedModal from './Modals/ReviewAcceptedModal';
import ReviewCompletedModal from './Modals/ReviewCompletedModal';
import ReviewDeclinedModal from './Modals/ReviewDeclinedModal';
import Notification from '../Notification';

const modals = [
  {
    id: 'requests',
    icon: QuestionMarkCircleIcon,
    name: 'Seminar Review Request',
    detail: 'Press accept or decline. Press outside of the pop-up to withhold your decision.',
    href: '#',
    iconForeground: 'text-yellow-700',
    iconBackground: 'bg-yellow-50',
  },
  {
    id: 'accepted',
    icon: PencilSquareIcon,
    name: 'Seminar Review Request',
    detail: 'Please write a review for the presentation!',
    href: '#',
    iconForeground: 'text-green-700',
    iconBackground: 'bg-green-50',
  },
  {
    id: 'completed',
    icon: CheckCircleIcon,
    name: 'Review Completed',
    detail: 'Thank you for your efforts',
    href: '#',
    iconForeground: 'text-green-700',
    iconBackground: 'bg-green-50',
  },
  {
    id: 'declined',
    icon: XCircleIcon,
    name: 'Seminar Review Request',
    detail: 'This is the seminar information you declined to review.',
    href: '#',
    iconForeground: 'text-red-700',
    iconBackground: 'bg-red-50',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// function DateTimeDisplay({ category, presentationInfo }) {
//   switch (category) {
//     case 'requests':
//       return (
//         <p>
//           requests on <time dateTime={presentationInfo.requestedAt}>{presentationInfo.requestedAt}</time>
//         </p>
//       );

//     case 'accepted':
//       return (
//         <p>
//           Accepted on <time dateTime={presentationInfo.acceptedDate}>{presentationInfo.acceptedDate}</time>
//         </p>
//       );

//     case 'finished':
//       return (
//         <p>
//           Finished on <time dateTime={presentationInfo.finishedDate}>{presentationInfo.finishedDate}</time>
//         </p>
//       );

//     case 'declined':
//       return (
//         <p>
//           Declined on <time dateTime={presentationInfo.declinedDate}>{presentationInfo.declinedDate}</time>
//         </p>
//       );
//     default: return (<p>---</p>);
//   }
// }

function parseReviewRequests(requests) {
  const parsedList = requests.map((e) => {
    return {
      requestId: +`${e.id}`,
      name: `${e.payload2}`,
      title: `${e.payload5}`,
      alias: `${e.payload4}`,
      tags: `${e.payload6}`,
      requestedAt: `${e.createdAt}`,
      dueTo: `${e.due}`,
    };
  })

  return parsedList;
}

export default function Review() {
  const [isModalOpen, setIsModalOpen] = useState(0);
  const [isNotify, setIsNotify] = useState(false);
  const [message, setMessage] = useState({ type: 'success', title: 'Confirmed!', details: 'Test message initiated.', });

  const [reviewItems, setReviewItems] = useState([]);

  const { data: reviewRequestData, error, isLoading } = useSWR(`/api/request/review`);

  const [seminarAlias, setSeminarAlias] = useState(null);
  const { data: seminarData, error: seminarError, isLoading: seminarIsLoading } = useSWR(
    seminarAlias ? `/api/seminar/${seminarAlias}` : null);

  const [requestId, setRequestId] = useState(null);


  useEffect(() => {
    if (reviewRequestData && reviewRequestData.ok) {

      let items = [];

      const pendingList = parseReviewRequests(reviewRequestData.pendingList);
      const requests = {
        category: 'requests',
        descriptions: 'Please accept or decline the requests.',
        list: pendingList,
      };
      items.push(requests)

      const acceptedList = parseReviewRequests(reviewRequestData.acceptedList);
      const accepts = {
        category: 'accepted',
        descriptions: 'Please write a review for the presentation!',
        list: acceptedList,
      };
      items.push(accepts)

      const completedList = parseReviewRequests(reviewRequestData.completedList);
      const completes = {
        category: 'completed',
        descriptions: 'Thanks for your efforts :)',
        list: completedList,
      };
      items.push(completes)

      const declinedList = parseReviewRequests(reviewRequestData.declinedList);
      const declines = {
        category: 'declined',
        descriptions: 'List of declined presentations.',
        list: declinedList,
      };
      items.push(declines)

      setReviewItems(items);
    }
  }, [reviewRequestData])

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

      {/* <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Peer Review</h1>
          <p className="mt-2 text-sm text-gray-700">
            Check the list below:
          </p>
        </div>
      </div> */}


      {reviewItems?.map((item) => (
        <div key={item.category} className="overflow-hidden bg-white border border-gray-300 shadow-lg sm:rounded-md mt-4">
          <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{item?.list?.length} {item?.category}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {item?.descriptions}
            </p>
          </div>
          <ul role="list" className="divide-y divide-gray-200">
            {item?.list?.map((presentation) => (
              <li key={presentation.alias}>
                <a href="#" className="block hover:bg-gray-50" onClick={(evt) => {
                  evt.preventDefault();
                  setSeminarAlias(`${presentation.alias}`);
                  setRequestId(presentation.requestId);
                  setIsModalOpen(item.category);
                }}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-sky-600">[{presentation.alias}] {presentation.title}</p>
                      <div className="ml-2 flex flex-shrink-0">
                        <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          {/* {presentation.name} */}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <UserIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                          {presentation.name}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <TagIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                          {presentation.tags}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {/* <DateTimeDisplay category={item.category} presentationInfo={presentation} /> */}
                        <p>due to <time dateTime={presentation.dueTo}>{format(parseISO(presentation.dueTo), "yyyy-MM-dd HH:mm:ss")}</time></p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>))}

      <ReviewPendingModal props={{
        modal: modals[0], isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage,
        requestId, seminarData: seminarData?.seminar
      }} />
      <ReviewAcceptedModal props={{
        modal: modals[1], isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage,
        requestId, seminarData: seminarData?.seminar
      }} />
      <ReviewCompletedModal props={{
        modal: modals[2], isModalOpen, setIsModalOpen, 
        requestId, seminarData: seminarData?.seminar
      }} />
      <ReviewDeclinedModal props={{
        modal: modals[3], isModalOpen, setIsModalOpen, 
        requestId, seminarData: seminarData?.seminar
      }} />


    <Notification props={{message, isNotify, setIsNotify}}/>

    </div>
  )
}