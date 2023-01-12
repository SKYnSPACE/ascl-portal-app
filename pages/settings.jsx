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

import { classNames } from '../libs/frontend/utils'

import CreateUserModal from '../components/Settings/Modals/CreateUserModal'
import EditUserModal from '../components/Settings/Modals/EditUserModal'
import Notification from '../components/Notification'
import SetUserModal from '../components/Settings/Modals/SetUserModal';

const settings = [
  {
    category: 'User', items:
      [{ id: 1, name: 'Create User', href: '#', detail: '신규 유저를 생성합니다. 필수 항목들만 입력하며, 나머지 항목(권한, 팀설정, ...)들은 편집화면을 통해 설정합니다.', iconBackground: 'bg-pink-100', iconForeground: 'text-pink-600', icon: UsersIcon},
      { id: 2, name: 'Edit', href: '#', detail: '기존 유저를 편집/삭제 합니다.', iconBackground: 'bg-yellow-100', iconForeground: 'text-yellow-600', icon: UsersIcon },
      { id: 3,  name: 'Set', href: '#', detail: '유저들의 직위(권한), 담당업무를 설정합니다.', iconBackground: 'bg-green-100', iconForeground: 'text-green-600', icon: UsersIcon },]
  },
  {
    category: 'Semester', items:
      [{ id: 11, name: 'Create', href: '#', detail: '신규 학기를 생성합니다.', iconBackground: 'bg-pink-100', iconForeground: 'text-pink-600', icon: AcademicCapIcon },
      { id: 12, name: 'Edit', href: '#', detail: '학기 정보를 편집/삭제 합니다.', iconBackground: 'bg-yellow-100', iconForeground: 'text-yellow-600', icon: AcademicCapIcon },
      { id: 13,  name: 'Set', href: '#', detail: '시스템 기준학기(현재학기)를 설정합니다.', iconBackground: 'bg-green-100', iconForeground: 'text-green-600', icon: AcademicCapIcon },]
  },
  {
    category: 'Seminar', items:
      [{ id: 21, name: 'Create', href: '#', detail: '세미나 발표일정(슬롯)을 생성합니다.', iconBackground: 'bg-pink-100', iconForeground: 'text-pink-600', icon: CalendarDaysIcon },
      { id: 22,  name: 'Edit', href: '#', detail: '기존 일정(슬롯)을 편집합니다.', iconBackground: 'bg-yellow-100', iconForeground: 'text-yellow-600', icon: CalendarDaysIcon },]
  },
]

export default function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(0);
  const [isNotify, setIsNotify] = useState(false);
  const [message, setMessage] = useState({ type: 'success', title: 'Confirmed!', details: 'Test message initiated.', });

  const { data: usersData, error: getUsersError, isLoading: getUsersLoading } = useSWR(
    typeof window === "undefined" ? null : "/api/settings/user"
  );

  return (
    <main className="relative -mt-32">

      <div className="mx-auto max-w-7xl px-4 mb-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
        <div className="overflow-hidden rounded-lg bg-white shadow">

          {settings.map((setting) => (
            <div key={setting.category} className="m-6">

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-start">
                  {/* <span className="bg-white pr-3 text-lg font-medium text-gray-900">Projects</span> */}
                  <h2 className="text-m font-medium bg-white pr-3 text-gray-700">{setting.category} settings</h2>
                </div>
              </div>
{/* //TODO: isNotify 일 때 DISABLE MENU!!! */}
              <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {setting.items.map((item) => (
                  <a key={item.id} href={item.href} onClick={(evt) => {
                    evt.preventDefault();
                    setIsModalOpen(item.id);
                  }}>
                    <li className="col-span-1 flex rounded-md shadow-sm">
                      <div
                        className={classNames(
                          item.iconBackground,
                          'flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md'
                        )}
                      >
                        <item.icon className={classNames(item.iconForeground,'h-8 w-8')} aria-hidden="true" />
                      </div>
                      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
                        <div className="flex-1 truncate px-4 py-2 text-sm">

                          <p className="font-medium text-gray-900 hover:text-gray-600">
                            {item.name}
                          </p>
                          <p className="truncate text-gray-500">{item.detail}</p>

                        </div>
                        <div className="flex-shrink-0 pr-2">
                          <button
                            type="button"
                            // className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500"
                            disabled
                          >
                            <span className="sr-only">Open options</span>
                            <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </li>
                  </a>
                ))}
              </ul>

            </div>
          ))}


        </div>
      </div>


<CreateUserModal props={{ action: settings[0].items[0], isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage }}/>
<EditUserModal props={{ action: settings[0].items[1], usersData, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage }}/>
<SetUserModal props={{ action: settings[0].items[2], usersData, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage}} />

<Notification props={{message, isNotify, setIsNotify}}/>

    </main>
  )
}