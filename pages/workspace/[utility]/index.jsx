import { useRouter } from 'next/router';

import {
  BellAlertIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  IdentificationIcon,
  PresentationChartLineIcon,
  StarIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

import useUser from '../../../libs/frontend/useUser';

import Page404 from '../../../components/Page404';
import Calendar from '../../../components/Workspace/Calendar';
import Attendance from '../../../components/Workspace/Attendance';
import BusinessTrip from '../../../components/Workspace/BusinessTrip';
import Ledger from '../../../components/Workspace/Ledger';
import Contacts from '../../../components/Workspace/Contacts';

import Purchasing from '../../../components/Workspace/Purchasing';
import Requests from '../../../components/Workspace/Requests';
import Manage from '../../../components/Workspace/Manage';



const subNavigation = [
  { id: 0, name: 'Received Requests', href: '/workspace/requests', icon: BellAlertIcon, minPosition: 2, onDev: false },
  { id: 1, name: 'Manage Requests', href: '/workspace/manage', icon: StarIcon, minPosition: 3, onDev: false },
  { id: 30, name: 'Purchasing', href: '/workspace/purchasing', icon: CreditCardIcon, minPosition: 2, onDev: false },
  { id: 31, name: 'Business Trip', href: '/workspace/trip', icon: BriefcaseIcon, minPosition: 2, onDev: false },
  { id: 100, name: '', minPosition: 0 },

  { id: 4, name: 'Lab. Calendar', href: '/workspace/calendar', icon: CalendarDaysIcon, minPosition: 2, onDev: true },
  { id: 5, name: 'Contacts', href: '/workspace/contacts', icon: IdentificationIcon, minPosition: 2, onDev: false },
  { id: 8, name: 'Attendance', href: '/workspace/attendance', icon: UsersIcon, minPosition: 2, onDev: true },

  { id: 101, name: '', minPosition: 0 },

  { id: 6, name: 'Ledger', href: '/workspace/ledger', icon: ClipboardDocumentListIcon, minPosition: 2, onDev: true },
  { id: 7, name: 'Conferences', href: '/workspace/conferences', icon: PresentationChartLineIcon, minPosition: 2, onDev: true },


]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Utility() {
  const router = useRouter();
  const utility = router.query.utility;

  switch (utility) {
    case 'calendar':
      // return <Page404 />;
      return <Calendar />;

    case 'requests':
      // return <Page404 />;
      return <Requests />;

    case 'manage':
      // return <Page404 />;
      return <Manage />;

    case 'trip':
      // return <Page404 />;
      return <BusinessTrip />;

    case 'attendance':
      return <Page404 />;
    // return <Attendance />;

    case 'purchasing':
      // return <Page404 />;
      return <Purchasing />;


    case 'ledger':
      return <Page404 />;
    // return <Ledger />;

    case 'contacts':
      return <Contacts />;

    default:
      return <Page404 />;
  }
}

export default function Workspace() {
  const router = useRouter();
  const { user } = useUser();

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

                  <div key={item.id}>
                    {user?.position >= item.minPosition ? <>
                      {item.name ?
                        <a
                          href={item.href}
                          className={classNames(
                            item.href === router.asPath
                              ? 'bg-sky-50 border-sky-500 text-sky-700 hover:bg-sky-50 hover:text-sky-700'
                              : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                            item.onDev ? 'line-through decoration-double' : '',
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
                        : <hr className="bg-gray-200" />}</> : <></>}
                  </div>
                ))}
              </nav>
            </aside>


            {/* Actual page section */}
            <form className="divide-y divide-gray-200 lg:col-span-9" action="#" method="POST">

              <div className="py-6 px-4 sm:p-6 lg:pb-8">


                <Utility />



              </div>
            </form>




          </div>
        </div>
      </div>
    </main>
  )
}