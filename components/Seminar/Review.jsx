import { useState, Fragment, useEffect } from 'react'
import useSWR from "swr";

import { CalendarIcon, TagIcon, UserIcon } from '@heroicons/react/20/solid'
import {
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  BriefcaseIcon,
  CreditCardIcon,
  PaperAirplaneIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'

import ReviewAcceptModal from './Modals/ReviewAcceptModal'



const items = [
  {
    category: 'requests',
    descriptions: 'Please accept or decline the requests.',
    list: [
      {
        name: 'Seongheon Lee',
        title: 'Dynamic modeling and control of mechanical systems using machine learning approaches and their applications to a quadrotor UAV',
        alias: '2022-F',
        tags: 'UAV, AI, quadrotor, modeling, control',
        requestedAt: '2022-12-29 23:00',
      },
      {
        name: 'Hyochoong Bang',
        title: '프로젝트 담당자 할당 및 바람직한 랩 생활을 위한 조언',
        alias: '2022-F',
        tags: 'ASCL',
        requestedAt: '2022-12-29 23:00',
      },
    ],
  },
  {
    category: 'accepted',
    descriptions: 'Please write a review for the presentation!',
    list: [
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...1', alias: '2022-F', },
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...2', alias: '2022-F', },
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...3', alias: '2022-F', },
    ],
  },
  {
    category: 'finished',
    descriptions: 'Thanks for your efforts :)',
    list: [
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...1', alias: '2022-F', },
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...2', alias: '2022-F', },
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...3', alias: '2022-F', },
    ],
  },
  {
    category: 'declined',
    descriptions: 'List of declined presentations.',
    list: [
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...1', alias: '2022-F', },
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...2', alias: '2022-F', },
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...3', alias: '2022-F', },
    ],
  },
]

const modals = [
  {
    id: 1,
    icon: QuestionMarkCircleIcon,
    name: 'Seminar Review Request',
    detail: 'Press accept or decline. Press outside of the pop-up to withhold your decision.',
    href: '#',
    iconForeground: 'text-yellow-700',
    iconBackground: 'bg-yellow-50',
  },
  {
    id: 2,
    icon: ArrowRightOnRectangleIcon,
    name: 'Carry-out report',
    detail: '실험실 물품 반출/반납 대장',
    href: '#',
    iconForeground: 'text-purple-700',
    iconBackground: 'bg-purple-50',
  },
  {
    id: 3,
    icon: CreditCardIcon,
    name: 'Credit-card Use',
    detail: '법인카드 사용을 위한 일정 문의',
    href: '#',
    iconForeground: 'text-sky-700',
    iconBackground: 'bg-sky-50',
  },
  {
    id: 4,
    icon: BanknotesIcon,
    name: 'Purchase Request',
    detail: '공동구매를 위한 물품 기록',
    href: '#',
    iconForeground: 'text-yellow-700',
    iconBackground: 'bg-yellow-50',
  },
  {
    id: 5,
    icon: BriefcaseIcon,
    name: 'Business Trip',
    detail: 'Request account information for a business trip.',
    href: '#',
    iconForeground: 'text-rose-700',
    iconBackground: 'bg-rose-50',
  },
  {
    id: 6,
    icon: PaperAirplaneIcon,
    name: 'Stepping Out',
    detail: 'Report for a temporary absence from a office, vacation, etc.',
    href: '#',
    iconForeground: 'text-indigo-700',
    iconBackground: 'bg-indigo-50',
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

function parseReviewRequests(requests){
  const parsedList = requests.map((e) => {
    return {
      name: `${e.payload2}`,
      title: `${e.payload5}`,
      alias: `${e.payload4}`,
      tags: `${e.payload6}`,
      requestedAt: `${e.createdAt}`
    };
  })

  return parsedList;
}

export default function Review() {
  const [isModalOpen, setIsModalOpen] = useState(0); //0: None, 1: Accept/Decline, 2: Write Review, 3: Modify Review, 4: Presentation Info
  const [items, setItems] = useState([]);

  const { data:reviewRequestData, error, isLoading } = useSWR(`/api/request/review`);

  const [seminarAlias, setSeminarAlias] = useState(null);
  const { data:seminarData, error:seminarError, isLoading:seminarIsLoading } = useSWR(
    seminarAlias ? `/api/seminar/${seminarAlias}` : null);


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

      const declinedList = parseReviewRequests(reviewRequestData.declinedList);
      const declines = {
        category: 'accepted',
        descriptions: 'Please write a review for the presentation!',
        list: declinedList,
      };
      items.push(declines)


      setItems(items);
    }
  }, [reviewRequestData])

  useEffect(()=>{
    console.log(seminarAlias)
  },[seminarAlias])

  useEffect(()=>{
    console.log(seminarData?.seminar)
  },[seminarData])

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


      {items?.map((item) => (
        <div className="overflow-hidden bg-white border border-gray-300 shadow-lg sm:rounded-md mt-4">
          <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{item?.list?.length} {item?.category}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {item?.descriptions}
            </p>
          </div>
          <ul role="list" className="divide-y divide-gray-200">
            {item?.list?.map((presentation) => (
              <li key={item.category}>
                <a href="#" className="block hover:bg-gray-50" onClick={(evt) => {
                  evt.preventDefault();
                  setIsModalOpen(1);
                  setSeminarAlias(`${presentation.alias}`);
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
                        <p>requests on <time dateTime={presentation.requestedAt}>{presentation.requestedAt}</time></p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>))}

      <ReviewAcceptModal props={{ modal: modals[0], isModalOpen, setIsModalOpen, seminarData:seminarData?.seminar }} />

    </div>
  )
}