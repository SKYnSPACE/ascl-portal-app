import { useContext, useEffect, useState } from 'react';
import useUser from '../libs/frontend/useUser';
import { SWRConfig } from "swr";

import {
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  BriefcaseIcon,
  CreditCardIcon,
  MegaphoneIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline'

import LocalDatabase from '../components/LocalDatabase'
import AnnouncementModal from '../components/Modals/AnnouncementModal';
import CarryoutModal from '../components/Modals/CarryoutModal';
import CreditcardModal from '../components/Modals/CreditcardModal';
import PurchaseModal from '../components/Modals/PurchaseModal';
import BusinessTripModal from '../components/Modals/BusinessTripModal';
import SteppingoutModal from '../components/Modals/SteppingoutModal';
import Notification from '../components/Notification';

const actions = [
  {
    id: 1,
    icon: MegaphoneIcon,
    name: 'Post an announcement',
    detail: 'Post something you want to share with all ASCL members.',
    href: '#',
    iconForeground: 'text-teal-700',
    iconBackground: 'bg-teal-50',
    onDev: true,
  },
  {
    id: 2,
    icon: ArrowRightOnRectangleIcon,
    name: 'Rent a equipment',
    detail: 'Rent or Return Lab. items/equipments',
    href: '#',
    iconForeground: 'text-purple-700',
    iconBackground: 'bg-purple-50',
    onDev: true,
  },
  {
    id: 3,
    icon: CreditCardIcon,
    name: 'Credit-card Use',
    detail: 'Inquiry for corporate card use',
    href: '#',
    iconForeground: 'text-sky-700',
    iconBackground: 'bg-sky-50',
    onDev: true,
  },
  {
    id: 4,
    icon: BanknotesIcon,
    name: 'Purchasing',
    detail: 'Request for an account usage to handle expenses. Please separate each purchase.',
    href: '#',
    iconForeground: 'text-yellow-700',
    iconBackground: 'bg-yellow-50',
    onDev: false,
  },
  {
    id: 5,
    icon: BriefcaseIcon,
    name: 'Business Trip',
    detail: 'Request for an account usage for a business trip.',
    href: '#',
    iconForeground: 'text-rose-700',
    iconBackground: 'bg-rose-50',
    onDev: false,
  },
  {
    id: 6,
    icon: PaperAirplaneIcon,
    name: 'Stepping Out',
    detail: 'Report for a temporary absence from a office, vacation, etc.',
    href: '#',
    iconForeground: 'text-indigo-700',
    iconBackground: 'bg-indigo-50',
    onDev: true,
  },
]
//TODO: MOVE DATA BELOW TO THE DB.
const recentRequests = [
  {
    name: 'Junwoo Park',
    tag: 'seminar-02-221221-001',
    imageUrl:
      'https://avatars.githubusercontent.com/u/25346867?v=4',
    href: '#',
  },
  {
    name: 'Kyungwoo Hong',
    tag: 'purchase-221220-001',
    imageUrl:
      'https://avatars.githubusercontent.com/u/25144685?v=4',
    href: '#',
  },
  {
    name: 'Kyungwoo Hong',
    tag: 'card-221220-001',
    imageUrl:
      'https://avatars.githubusercontent.com/u/25144685?v=4',
    href: '#',
  },
  {
    name: 'Junwoo Park',
    tag: 'vacation-221219-001',
    imageUrl:
      'https://avatars.githubusercontent.com/u/25346867?v=4',
    href: '#',
  },
]
const announcements = [
  {
    id: 1,
    title: '22y 2nd Lab. seminar on Dec 25th',
    href: '#',
    preview:
      ' We do the Lab. seminar.',
  },
  {
    id: 2,
    title: 'New password policy',
    href: '#',
    preview:
      'Change your password now with 2 digits!',
  },
  {
    id: 3,
    title: 'Office closed on Dec 31.',
    href: '#',
    preview:
      'Do not come to the office.',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function getRole(position) {
  switch (position) {
    case 1: return 'Part-time Researcher';
    case 2: return 'Full-time Researcher';
    case 3: return 'Account manager';
    case 4: return 'Team leader';
    case 5: return 'Lab. Manager';
    case 6: return 'Secretary';
    case 7: return 'Professor';
    case 100: return 'Administrator';
    case 0:
    default:
      return 'Guest';
  }
}

function getInitials(name) {
  const fullName = name?.toString().split(' ');
  if (!fullName) return '^^';

  const initials = [fullName[0].charAt(0), fullName[1].charAt(0)];
  return initials.join('');
}

function getCategory(kind){
  switch(+kind){
    case 30:
      return 'purchase'
    case 35:
      return 'business-trip'
    case 90:
      return 'seminar'

  }
}

function getHref(kind){
  switch(+kind){
    case 30:
      return '/workspace/requests'
    case 35:
      return '/workspace/requests'
    case 90:
      return '/seminar/review'
  }
}

export default function Home() {
  const localDatabase = useContext(LocalDatabase);
  // const user = useContext(LocalDatabase).user;
  const { user } = useUser();
  // console.log(user)

  const [isModalOpen, setIsModalOpen] = useState(0)
  const [isNotify, setIsNotify] = useState(false);
  const [message, setMessage] = useState({ type: 'success', title: 'Confirmed!', details: 'Test message initiated.', });

  const [stats, setStats] = useState([
    { label: 'Requests waiting', value: 0, href: '/workspace/requests' },
    { label: 'Actions required', value: 0, href: '#' },
    { label: 'Vacation days left', value: 0, href: '#' },
  ]);

  const [recentRequests, setRecentRequests] = useState([]);

  const fetchAvatar = async (userId) => {
    const res = await fetch(`/api/users/${userId}`).then((response) => {
      return response.json();
    }).then((data) => {
      if (data.ok && data.selectedUser)
        return data.selectedUser.avatar;
    });
  }

  // const closeAnnouncementModal = () => { setIsAnnouncementModalOpen(false) }

  useEffect(() => {
    let stats = [];

    if (user?.requests) {
      stats.push({ label: 'Workspace Requests', value: user.requests.filter(request => +request.kind == 30)?.length, href: '/workspace/requests' })
      stats.push({ label: 'Review Requests', value: user.requests.filter(request => +request.kind == 90)?.length, href: '/seminar/review' })

      let recentRequests = [];

      user?.requests?.map(async (request) => {
        const requesterId = +request.payload1;
        
          const res = await fetch(`/api/users/${requesterId}`).then((response) => {
            return response.json();
          }).then((data) => {
            if (data.ok && data.selectedUser){
              recentRequests.push({
                id: +request.id,
                name: request.payload2,
                tag: getCategory(request.kind) + '-' + request.payload6,
                // imageUrl:
                //   'https://avatars.githubusercontent.com/u/25346867?v=4',
                href: getHref(request.kind),
                imageUrl: data.selectedUser.avatar,
              },
              )
              setRecentRequests(recentRequests);
            }
          });
        })


      //   recentRequests.push({
      //     id: +request.id,
      //     name: 'Junwoo Park',
      //     tag: 'seminar-02-221221-001',
      //     imageUrl:
      //       'https://avatars.githubusercontent.com/u/25346867?v=4',
      //     href: '#',
      //     etc: fetchAvatar(+request.payload1),
      //   },
      //   )
      // })

      

      // console.log(recentRequests)
    }

    stats.push(
      { label: 'Actions required', value: 0, href: '#' },
      // { label: 'Vacation days left', value: 0, href: '#' },
    )
    setStats(stats)
  }, [user]);

  useEffect(() => {
    console.log(recentRequests)
  }, [recentRequests])

  return (
    <>
      {user?.name ?
        <main className="-mt-24 pb-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="sr-only">Profile</h1>
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                {/* Welcome panel */}
                <section aria-labelledby="profile-overview-title">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <h2 className="sr-only" id="profile-overview-title">
                      Profile Overview
                    </h2>
                    <div className="bg-white p-6">
                      <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="sm:flex sm:space-x-5">
                          <div className="flex-shrink-0">
                            {/* <img className="mx-auto h-20 w-20 rounded-full" src={user?.avatar} alt="" /> */}

                            <div className="h-20 w-20 rounded-full flex justify-center items-center bg-gray-400 text-4xl text-white">
                              {user?.avatar ? <img className="rounded-full" src={user?.avatar} alt="" />
                                : getInitials(user?.name)}
                            </div>


                          </div>
                          <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                            <p className="text-sm font-medium text-gray-600">Welcome back,</p>
                            <p className="text-xl font-bold text-gray-900 sm:text-2xl">{user?.name}</p>
                            <p className="text-sm font-medium text-gray-600">{getRole(user?.position)}</p>
                          </div>
                        </div>
                        <div className="mt-5 flex justify-center sm:mt-0">
                          <a
                            href="/profile"
                            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                          >
                            View profile
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                      {stats.map((stat) => (
                        <div key={stat.label} className="px-6 py-5 text-center text-sm font-medium">
                          <a href={stat.href} className="">
                            <span className="text-gray-900">{stat.value}</span>
                            {' '}
                            <span className="text-gray-600">{stat.label}</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Actions panel */}
                <section aria-labelledby="quick-links-title">
                  <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
                    <h2 className="sr-only" id="quick-links-title">
                      Quick links
                    </h2>
                    {actions.map((action, actionIdx) => (
                      <div
                        key={action.name}
                        className={classNames(
                          actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
                          actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
                          actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
                          actionIdx === actions.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
                          action.onDev ? 'bg-gray-100' : 'bg-white',
                          'relative group p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-cyan-500'
                        )}
                      >
                        <div>
                          <span
                            className={classNames(
                              action.iconBackground,
                              action.iconForeground,
                              'rounded-lg inline-flex p-3 ring-4 ring-white'
                            )}
                          >
                            <action.icon className="h-6 w-6" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="mt-8">
                          <h3 className="text-lg font-medium">
                            <a href={action.href} className={classNames(
                              action.onDev ? 'cursor-not-allowed' : '',
                              "focus:outline-none"
                            )} onClick={(evt) => {
                              evt.preventDefault();
                              if (action.onDev) return;
                              setIsModalOpen(action.id);
                            }}>
                              {/* Extend touch target to entire panel */}
                              <span className="absolute inset-0" aria-hidden="true" />
                              {action.name}
                            </a>
                          </h3>
                          <p className="mt-2 text-sm text-gray-500">
                            {action.detail}
                          </p>
                        </div>
                        <span
                          className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                          aria-hidden="true"
                        >
                          <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                          </svg>
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="grid grid-cols-1 gap-4">
                {/* Announcements */}
                <section aria-labelledby="announcements-title">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <h2 className="text-base font-medium text-gray-900" id="announcements-title">
                        Announcements
                      </h2>

                      {/* <div className="mt-6 flow-root">
                        <ul role="list" className="-my-5 divide-y divide-gray-200">
                          {announcements.map((announcement) => (
                            <li key={announcement.id} className="py-5">
                              <div className="relative focus-within:ring-2 focus-within:ring-cyan-500">
                                <h3 className="text-sm font-semibold text-gray-800">
                                  <a href={announcement.href} className="hover:underline focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true" />
                                    {announcement.title}
                                  </a>
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{announcement.preview}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div> */}

                      <div className="mt-6">
                        <a
                          href="#"
                          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          View all
                        </a>
                      </div>
                      
                    </div>
                  </div>
                </section>

                {/* Recent Requests */}
                <section aria-labelledby="recent-requests-title">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <h2 className="text-base font-medium text-gray-900" id="recent-requests-title">
                        Recent Requests
                      </h2>
                      <div className="mt-6 flow-root">
                        <ul role="list" className="-my-5 divide-y divide-gray-200">
                          {recentRequests.map((person) => (
                            <li key={person.id} className="py-4">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  {/* <img className="h-8 w-8 rounded-full" src={person.imageUrl} alt="" /> */}

                                  <div className="h-8 w-8 rounded-full flex justify-center items-center bg-gray-400 text-lg text-white">
                              {person?.imageUrl ? <img className="rounded-full" src={person?.imageUrl} alt="" />
                                : <span>{getInitials(person?.name)}</span>}
                            </div>




                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-gray-900">{person.name}</p>
                                  <p className="truncate text-sm text-gray-500">{'#' + person.tag}</p>
                                </div>
                                <div>
                                  <a
                                    href={person.href}
                                    className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50"
                                  >
                                    View
                                  </a>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* <div className="mt-6">
                        <a
                          href="#"
                          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          View all
                        </a>
                      </div> */}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>


          <AnnouncementModal props={{ action: actions[0], isModalOpen, setIsModalOpen }} />
          <CarryoutModal props={{ action: actions[1], isModalOpen, setIsModalOpen }} />
          <CreditcardModal props={{ action: actions[2], isModalOpen, setIsModalOpen }} />
          <PurchaseModal props={{ action: actions[3], isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage }} />
          <BusinessTripModal props={{ action: actions[4], isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage }} />
          <SteppingoutModal props={{ action: actions[5], isModalOpen, setIsModalOpen }} />


          <Notification props={{ message, isNotify, setIsNotify }} />

        </main>
        : <>Session expired.<br />Refresh the page to sign in.</>}
    </>
  )
}