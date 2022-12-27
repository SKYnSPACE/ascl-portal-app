import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'


import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Attendance() {
  return (


    <div className="lg:flex lg:h-full lg:flex-col">
      {/* //TODO: REMOVE following div section */}
      <div>
        <h2 className="text-lg font-medium leading-6 text-gray-900">Attendance</h2>
        <p className="mt-1 text-sm text-gray-500">
          Will be updated soon.
          <br />
          Personal Schedules, Vacations, etc.
        </p>
      </div>

    </div>
  );
}