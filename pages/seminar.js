import { Schedule } from '../components/Schedule'

import {
  ArchiveBoxArrowDownIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline'

const subNavigation = [
  { name: 'Schedule', href: '#', icon: CalendarDaysIcon, current: true },
  { name: 'Progress', href: '#', icon: ClipboardDocumentCheckIcon, current: false },
  { name: 'Submission', href: '#', icon: ArchiveBoxArrowDownIcon, current: false },
  { name: 'Peer review', href: '#', icon: ChatBubbleLeftRightIcon, current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Seminar() {
  return (
    <>
      {/* <main className="relative -mt-32">

        <div className="mx-auto max-w-7xl px-4 mb-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Seminar</h1>
        </div>

        <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
          <Schedule />
        </div>

      </main> */}



      <main className="relative -mt-32">
        <div className="mx-auto max-w-7xl px-4 mb-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Seminar</h1>
        </div>
        <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
              <aside className="py-6 lg:col-span-3">
                <nav className="space-y-1">
                  {subNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-sky-50 border-sky-500 text-sky-700 hover:bg-sky-50 hover:text-sky-700'
                          : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                        'group border-l-4 px-3 py-2 flex items-center text-sm font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? 'text-sky-500 group-hover:text-sky-500'
                            : 'text-gray-400 group-hover:text-gray-500',
                          'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.name}</span>
                    </a>
                  ))}
                </nav>
              </aside>


              <div className="mx-auto max-w-screen-xl px-4 pb-6 lg:px-8 lg:pb-16 lg:col-span-9 sm:px-6">
          <Schedule />
        </div>


            </div>
          </div>
        </div>
      </main>

    </>

  )
}
