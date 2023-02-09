import { useRouter } from 'next/router';

import { useState, useEffect } from "react";
import useSWR from "swr";

import Page404 from '../../../components/Page404';
import Summary from '../../../components/Projects/Summary';
import Attendance from '../../../components/Workspace/Attendance';
import BusinessTrip from '../../../components/Workspace/BusinessTrip';
import Ledger from '../../../components/Workspace/Ledger';
import Contacts from '../../../components/Workspace/Contacts';

import {
  MinusIcon,
  Bars2Icon,
  Bars3Icon,
  Bars4Icon,
  AdjustmentsHorizontalIcon,
  BellAlertIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  IdentificationIcon,
  PresentationChartLineIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import Purchasing from '../../../components/Workspace/Purchasing';
import Requests from '../../../components/Workspace/Requests';
import Bankbook from '../../../components/Projects/Bankbook';


const subNavigation = [
  { name: 'Summary', href: '/projects/summary', icon: ClipboardDocumentListIcon, onDev: true },
  
  { name: 'Requests', href: '/projects/requests', icon: Bars3Icon, onDev: true },
  
  { name: 'Purchasing', href: '/projects/purchasing', icon: Bars4Icon, onDev:true },
  { name: 'Ledger', href: '/projects/ledger', icon: Bars3Icon, onDev:true },

  { name: 'Business Trip', href: '/projects/trip', icon: Bars3Icon, onDev:true },
  { name: 'Conferences', href: '/projects/conferences', icon: Bars3Icon, onDev:true },

  { name: 'Attendance', href: '/projects/attendance', icon: Bars2Icon, onDev:true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Alias() {
  const router = useRouter();
  const alias = router.query.alias;

  switch (alias) {
    case 'summary':
      // return <Page404 />;
      return <Summary />;

    default:
      return <Bankbook props={{alias}} />;
  }
}

export default function Workspace() {
  const router = useRouter();

  const { data, mutate, error, isLoading } = useSWR('/api/project');
  const [subNavigation, setSubNavigation] = useState([
    { name: 'Summary', href: '/projects/summary', icon: ClipboardDocumentListIcon, onDev: false },
  ]);

  useEffect(() => {
    if (isLoading) return;
    if (data && data.ok) {
      let subNavigation = [{ name: 'Summary', href: '/projects/summary', icon: ClipboardDocumentListIcon, onDev: false },]
      data.managingProjects?.map((project)=>{
        subNavigation.push({name: project.title, href: `/projects/${project.alias}`, icon: Bars3Icon, onDev:false})
      })
      data.staffingProjects?.map((project)=>{
        subNavigation.push({name: project.title, href: `/projects/${project.alias}`, icon: Bars2Icon, onDev:false})
      })
      data.participatingProjects?.map((project)=>{
        subNavigation.push({name: project.title, href: `/projects/${project.alias}`, icon: MinusIcon, onDev:false})
      })
      data.editableProjects?.map((project)=>{
        subNavigation.push({name: project.title, href: `/projects/${project.alias}`, icon: AdjustmentsHorizontalIcon, onDev:false})
      })
      setSubNavigation(subNavigation);
    }
  }, [data])

  return (
    <main className="relative -mt-32">
      <div className="mx-auto max-w-7xl px-4 mb-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Projects</h1>
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
                        item.onDev ? 'line-through decoration-double':'',
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


                <Alias />



              </div>
            </form>




          </div>
        </div>
      </div>
    </main>
  )
}