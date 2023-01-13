import { useState } from 'react'

import useSWR from "swr";


import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import {
  AcademicCapIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  ExclamationCircleIcon,
  IdentificationIcon,
  PresentationChartLineIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

import useUser from '../../libs/frontend/useUser';
import { classNames } from '../../libs/frontend/utils'
import EditNameModal from '../../components/Profile/Modals/EditNameModal';
import Notification from '../../components/Notification';
import EditPhoneModal from '../../components/Profile/Modals/EditPhoneModal';

const settings = [
  { id: 1, name: 'Edit Name', href: '#', detail: 'Change your first, and last name.', iconBackground: 'bg-yellow-100', iconForeground: 'text-yellow-600', icon: UsersIcon },
  { id: 2, name: 'Edit Phone Number', href: '#', detail: 'Change your phone number. Numbers in South Korea only.', iconBackground: 'bg-yellow-100', iconForeground: 'text-yellow-600', icon: UsersIcon },
]

const Duties = {
  seminar: 0b10000000,
  publications: 0b01000000,

  server: 0b00010000,
  computer: 0b00001000,

  safety: 0b00000010,
  news: 0b00000001,
}

function getPositionName(position) {
  switch (position) {
    case 0: return 'Guest';
    case 1: return 'Part-time Researcher';
    case 2: return 'Full-time Researcher';
    case 3: return 'Account Manager';
    case 4: return 'Team Leader';
    case 5: return 'Lab. Manager';
    case 6: return 'Secretary';
    case 7: return 'Professor';
    default: return 'Unknown';
  }
}

function getDutiesNames(duties) {
  if (!duties) return (<></>);
  return (<>
    {(duties & Duties.seminar) ? <span className="bg-sky-100 text-sky-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">랩세미나</span> : <></>}
    {(duties & Duties.publications) ? <span className="bg-sky-100 text-sky-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">실적관리</span> : <></>}
    {(duties & Duties.server) ? <span className="bg-green-100 text-green-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">서버관리</span> : <></>}
    {(duties & Duties.computer) ? <span className="bg-green-100 text-green-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">PC관리</span> : <></>}
    {(duties & Duties.safety) ? <span className="bg-yellow-100 text-yellow-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">안전관리</span> : <></>}
    {(duties & Duties.news) ? <span className="bg-yellow-100 text-yellow-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">뉴스레터</span> : <></>}
  </>);
}

function getInitials(name) {
  const fullName = name?.toString().split(' ');
  if (!fullName) return '^^';

  const initials = [fullName[0].charAt(0), fullName[1].charAt(0)];
  return initials.join('');
}

export default function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(0);
  const [isNotify, setIsNotify] = useState(false);
  const [message, setMessage] = useState({ type: 'success', title: 'Confirmed!', details: 'Test message initiated.', });

  const { user } = useUser();

  return (
    <main className="relative -mt-32">

      <div className="mx-auto max-w-7xl px-4 mb-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile</h1>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
        <div className="p-8 overflow-hidden rounded-lg bg-white shadow">



          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">User Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Contact Lab. Manager to change your ID, Email, position, or duties.</p>
          </div>
          <div className="mt-5 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">ID</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">{user?.userNumber}</span>

                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">{user?.name}</span>
                  <span className="ml-4 flex-shrink-0">
                    <button
                      type="button"
                      className="rounded-md bg-white font-medium text-sky-600 hover:text-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                      onClick={(evt) => {
                        evt.preventDefault();
                        setIsModalOpen(1);
                      }}
                    >
                      Edit
                    </button>
                  </span>
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">{user?.email}</span>
                </dd>
              </div>


              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">{user?.phone}</span>
                  <span className="ml-4 flex-shrink-0">
                    <button
                      type="button"
                      className="rounded-md bg-white font-medium text-sky-600 hover:text-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                      onClick={(evt) => {
                        evt.preventDefault();
                        setIsModalOpen(2);
                      }}
                    >
                      Edit
                    </button>
                  </span>
                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Position</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">{getPositionName(user?.position)}</span>

                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Duties</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">{getDutiesNames(user?.duties)}</span>



                </dd>
              </div>

              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">Avatar</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">
                    <div className="m-1 mb-4 w-12 h-12 relative flex justify-center items-center bg-gray-400 text-xl text-white">
                      {user?.avatar ? <img src={user?.avatar} alt="" />
                        : <span>{getInitials(user?.name)}</span>}
                    </div>

                    <div className="m-1 w-12 h-12 relative flex justify-center items-center rounded-full bg-gray-400 text-xl text-white">
                      {user?.avatar ? <img className="rounded-full" src={user?.avatar} alt="" />
                        : <span>{getInitials(user?.name)}</span>}
                    </div>
                  </span>

                  {/* <span className="ml-4 flex-shrink-0">
                    <button
                      type="button"
                      className="rounded-md bg-white font-medium text-sky-600 hover:text-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    >
                      Edit
                    </button>
                  </span> */}
                </dd>
              </div>

            </dl>
          </div>




        </div>
      </div>

      <EditNameModal props={{ action: settings[0], user, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage }} />
      <EditPhoneModal props={{ action: settings[1], user, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage }} />

      <Notification props={{ message, isNotify, setIsNotify }} />

    </main>
  )
}