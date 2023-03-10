import { useRouter } from 'next/router';

import Page404 from '../../../components/Page404';
import Calendar from '../../../components/Workspace/Calendar';
import Attendance from '../../../components/Workspace/Attendance';
import BusinessTrip from '../../../components/Workspace/BusinessTrip';
import Ledger from '../../../components/Workspace/Ledger';
import Contacts from '../../../components/Workspace/Contacts';

import {
  BriefcaseIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  IdentificationIcon,
  PresentationChartLineIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import Aerospace from '../../../components/Handbook/Aerospace';
import Regulations from '../../../components/Handbook/Regulations';



const subNavigation = [
  { name: 'Aerospace', href: '/handbook/aerospace', icon: CalendarDaysIcon },
  { name: 'Lab. Rules', href: '/handbook/regulations', icon: UsersIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Item() {
  const router = useRouter();
  const item = router.query.item;

  switch (item) {
    case 'aerospace':
      return <Page404 />;
      // return <Aerospace />;

    case 'regulations':
      return <Page404 />;
      // return <Regulations />;

    default:
      return <Page404 />;
  }
}

export default function Handbook() {
  const router = useRouter();

  return (
    <main className="relative -mt-32">
      <div className="mx-auto max-w-7xl px-4 mb-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Workspace</h1>
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
                      item.href === router.asPath
                        ? 'bg-sky-50 border-sky-500 text-sky-700 hover:bg-sky-50 hover:text-sky-700'
                        : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                      'group border-l-4 px-3 py-2 flex items-center text-sm font-medium'
                    )}
                    aria-current={item.href === router.asPath ? 'page' : undefined}
                  >
                    <item.icon
                      className={classNames(
                        item.href === router.asPath
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


            {/* Actual page section */}
            <form className="divide-y divide-gray-200 lg:col-span-9" action="#" method="POST">

              <div className="py-6 px-4 sm:p-6 lg:pb-8">


                <Item />



              </div>
            </form>




          </div>
        </div>
      </div>
    </main>
  )
}