import { useState } from 'react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'

import { classNames } from '../libs/frontend/utils'

import {
  AcademicCapIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  IdentificationIcon,
  PresentationChartLineIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import CreateUserModal from '../components/Settings/Modals/CreateUserModal'

const settings = [
  {
    category: 'User', items:
      [{ id: 1, name: 'Create User', href: '#', detail: '신규 유저를 생성합니다. 별표 항목은 필수 입력사항입니다.', iconBackground: 'bg-pink-100', iconForeground: 'text-pink-600', icon: UsersIcon},
      { id: 2, name: 'Edit', href: '#', detail: '기존 유저를 편집합니다.', iconBackground: 'bg-yellow-100', iconForeground: 'text-yellow-600', icon: UsersIcon },]
  },
  {
    category: 'Semester', items:
      [{ id: 11, name: 'Create', href: '#', detail: '신규 학기를 생성합니다.', iconBackground: 'bg-pink-100', iconForeground: 'text-pink-600', icon: AcademicCapIcon },
      { id: 12, name: 'Edit', href: '#', detail: '학기 정보를 편집합니다.', iconBackground: 'bg-yellow-100', iconForeground: 'text-yellow-600', icon: AcademicCapIcon },
      { id: 13,  name: 'Set', href: '#', detail: '시스템 기준학기(현재학기)를 설정합니다.', iconBackground: 'bg-green-100', iconForeground: 'text-green-600', icon: AcademicCapIcon },]
  },
  {
    category: 'Seminar', items:
      [{ id: 21, name: 'Create', href: '#', detail: '세미나 발표일정(슬롯)을 생성합니다.', iconBackground: 'bg-pink-100', iconForeground: 'text-pink-600', icon: CalendarDaysIcon },
      { id: 22,  name: 'Edit', href: '#', detail: '기존 일정(슬롯)을 편집합니다.', iconBackground: 'bg-yellow-100', iconForeground: 'text-yellow-600', icon: CalendarDaysIcon },]
  },
]

export default function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(0)

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


<CreateUserModal props={{ action: settings[0].items[0], isModalOpen, setIsModalOpen }}/>

    </main>
  )
}