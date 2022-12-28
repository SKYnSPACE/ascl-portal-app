import { Fragment } from 'react'

const items = [
  {
    category: '공용',
    list: [
      { name: '신한카드(0000)', location: '유레카관 4117', updated: 'Seongheon Lee @ 2020-10-10 00:00', status: 'normal' },
      { name: '우리카드(0000)', location: '이동우', updated: 'Dongwoo Lee @ 2020-10-10 00:00', status: 'taken' },
    ],
  },
  {
    category: '무인기팀',
    list: [
      { name: 'VN200-001', location: '무인기 실험실', updated: 'Seongheon Lee @ 2022-12-12 00:00', status: 'normal' },
      { name: 'VN200-002', location: '무인기 실험실', updated: 'Seongheon Lee @ 2022-12-12 00:00', status: 'broken' },
      { name: 'VN200-003', location: '유레카관 4117', updated: 'Dongwoo Lee @ 2020-10-10 00:00', status: 'taken' },
      { name: 'VN200-004', location: '무인기 실험실', updated: 'Seongheon Lee @ 2022-12-12 00:00', status: 'normal' },
      { name: 'VN200-005', location: '무인기 실험실', updated: 'Seongheon Lee @ 2022-12-12 00:00', status: 'normal' },
    ],
  },
  {
    category: '위성팀',
    list: [
      { name: 'VN200-001', location: '위성 실험실', updated: 'Seongheon Lee @ 2022-12-12 00:00', status: 'normal' },
      { name: 'VN200-002', location: '위성 실험실', updated: 'Seongheon Lee @ 2022-12-12 00:00', status: 'broken' },
      { name: 'VN200-003', location: '기계동 3316', updated: 'Snyoll Oghim @ 2022-12-12 00:00', status: 'taken' },
      { name: 'VN200-004', location: '위성 실험실', updated: 'Seongheon Lee @ 2022-12-12 00:00', status: 'normal' },
      { name: 'VN200-005', location: '위성 실험실', updated: 'Seongheon Lee @ 2022-12-12 00:00', status: 'normal' },
    ],
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Ledger() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">실험실 비품/물품/장비 대장</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all items belong to ASCL.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#2980b9] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-[#2980b9] focus:ring-offset-2 sm:w-auto"
          >
            Add Item
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
                      Last Updated
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {items.map((item) => (
                    <Fragment key={item.category}>
                      <tr className="border-t border-gray-200">
                        <th
                          colSpan={5}
                          scope="colgroup"
                          className="bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-gray-900 sm:px-6"
                        >
                          {item.category}
                        </th>
                      </tr>
                      {item.list.map((item, itemIdx) => (
                        <tr
                          key={item.email}
                          className={classNames(itemIdx === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {item.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.location}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.updated}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {/* {
                          (item) => { switch(item.status){
                            case 'normal': return (<span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                            Active
                          </span>);
                          }}
                          } */}
                            <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                              Normal
                            </span>
                            <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800">
                              Taken
                            </span>
                            <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                              Broken
                            </span>
                            <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                              Missing
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a href="#" className="text-[#2980b9] hover:text-cyan-900">
                              Edit
                            </a>
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