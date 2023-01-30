import { Fragment, useEffect } from 'react'
import useSWR from "swr";

import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'

import { classNames } from '../../libs/frontend/utils'

// const testUsers = [
//   {
//     position: 'Full-time Researcher',
//     people: [
//       { name: 'TEST1', phone: '123', email: 'test@example.com', location: 'AE3316 (ext.)' },
//       { name: 'User2', phone: '1234', email: 'asdfy@example.com', location: 'EU4119 (ext.)' },
//     ],
//   },
//   // More people...
// ]

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
    {(duties & Duties.seminar) ? <span className="bg-sky-100 text-sky-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">Seminar</span> : <></>}
    {(duties & Duties.publications) ? <span className="bg-sky-100 text-sky-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">Records</span> : <></>}
    {(duties & Duties.server) ? <span className="bg-green-100 text-green-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">Server</span> : <></>}
    {(duties & Duties.computer) ? <span className="bg-green-100 text-green-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">PC</span> : <></>}
    {(duties & Duties.safety) ? <span className="bg-yellow-100 text-yellow-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">Safety</span> : <></>}
    {(duties & Duties.news) ? <span className="bg-yellow-100 text-yellow-700 text-xs font-medium mr-2 px-2 py-0.5 rounded-full">News</span> : <></>}
  </>);
}

function sortUsers(users) {
  if (!users) return [];

  let sortedUsers = [];
  for (let i = 7; i > 0; --i) {
    sortedUsers.push({
      position: getPositionName(i),
      people: (users.filter(item => item.position === i)).sort((a, b) => a.userNumber - b.userNumber)
    })
  }

  return sortedUsers;
}

export default function Contacts() {
  const { data: usersData, error: getUsersError, isLoading: getUsersLoading } = useSWR(
    typeof window === "undefined" ? null : "/api/settings/user"
  );


  return (

    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Contacts</h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all current ASCL members.
          </p>
        </div>

      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full">
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-bold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                      Phone Number
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                      Location*
                    </th>
                    <th scope="col" className="py-3.5 text-center text-sm font-bold text-gray-900">
                      Duties
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {sortUsers(usersData?.users).map((user) => (
                    <Fragment key={user.position}>
                      <tr className="border-t border-gray-200">
                        <th
                          colSpan={5}
                          scope="colgroup"
                          className="bg-gray-50 px-4 py-2 text-left text-sm font-bold text-gray-900"
                        >
                          {user.position}
                        </th>
                      </tr>
                      {user.people.map((person, personIdx) => (
                        <tr
                          key={person?.id}
                          className={classNames(personIdx === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-600 sm:pl-6">
                            {person?.name}&ensp;({person?.userNumber})
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person?.phone}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person?.email}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> M ----</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-6">
                            {getDutiesNames(person?.duties)}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <p className="mt-4 text-sm text-gray-700">
            * A: Aerospace Engineering Building (N7-2): ext 0000 <br />
          &ensp; E: Eureka Hall (N27): ext 0000
          </p>
        </div>

      </div>

    </>
  )
}