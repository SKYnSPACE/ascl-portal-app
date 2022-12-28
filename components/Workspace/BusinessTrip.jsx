import { Fragment } from 'react'

const lists = [
  {
    name: 'Pending',
    people: [
      { name: 'Dongwoo Lee', location: 'Daejeon', starts: '2022-12-12 00:00', ends: '2022-12-12 00:00' },
      { name: 'Lorem Ipsum', location: 'Seoul', starts: '2022-12-12 00:00', ends: '2022-12-12 00:00' },
    ],
  },
  {
    name: 'Assigned',
    people: [
      { name: 'Dongwoo Lee', location: 'Daejeon', starts: '2022-12-12 00:00', ends: '2022-12-12 00:00' },
      { name: 'Lorem Ipsum', location: 'Seoul', starts: '2022-12-12 00:00', ends: '2022-12-12 00:00' },
    ],
  },
  // More people...
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function BusinessTrip() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">출장계정문의</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all researcher pending for accounts.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#2980b9] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-[#2980b9] focus:ring-offset-2 sm:w-auto"
          >
            Enquiry
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full">
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Location
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Start Date Time
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      End Date Time
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {lists.map((list) => (
                    <Fragment key={list.name}>
                      <tr className="border-t border-gray-200">
                        <th
                          colSpan={5}
                          scope="colgroup"
                          className="bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-gray-900 sm:px-6"
                        >
                          {list.name}
                        </th>
                      </tr>
                      {list.people.map((person, personIdx) => (
                        <tr
                          key={person.email}
                          className={classNames(personIdx === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {person.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.location}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.starts}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.ends}</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            {list.name === 'Pending' ?
                              <a href="#" className="text-[#2980b9] hover:text-cyan-900">
                                Process
                              </a> :
                              <a href="#" className="text-[#2980b9] hover:text-cyan-900">
                                Edit
                              </a>
                            }
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
    </div>
  )
}