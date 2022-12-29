import { Fragment } from 'react'

const items = [
  {
    category: 'Review Requests',
    list: [
      { name: 'Seongheon Lee', title: 'Dynamic modeling and control of mechanical systems using machine learning approaches and their applications to a quadrotor UAV',},
      { name: 'Hyochoong Bang', title: '프로젝트 담당자 할당 및 바람직한 랩 생활을 위한 조언',},
    ],
  },
  {
    category: 'Accepted (Please write a review!)',
    list: [
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...1',},
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...2',},
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...3',},
    ],
  },
  {
    category: 'Finished',
    list: [
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...1',},
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...2',},
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...3',},
    ],
  },
  {
    category: 'Declined',
    list: [
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...1',},
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...2',},
      { name: '홍길동', title: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...3',},
    ],
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Review() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Peer Review</h1>
          <p className="mt-2 text-sm text-gray-700">
            Check the list below:
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
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Title
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
                          colSpan={3}
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
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate text-ellipsis">{item.title}</td>

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