import { Fragment } from 'react'

const purchases = [
  {
    category: 'Pending', //계정문의 대기중
    lists: [
      { charge: '임철수', name: '청소기', price:0, method: '계산서', proposed: '2022-12-12', due: '2022-12-31' },
      { charge: '임철수', name: '파파존스', price:0, method: '카드', proposed: '2022-12-12', due: '2022-12-31' },
    ],
  },
  {
    category: 'Processing', //구매절차 진행중
    lists: [
      { charge: '임철수', name: 'VN-300', price:0, method: '계산서', proposed: '2022-12-12', due: '2022-12-31' },
      { charge: '임철수', name: '파파존스', price:0, method: '계산서', proposed: '2022-12-12', due: '2022-12-31' },
    ],
  },
  {
    category: 'Delayed', //기한지남(증빙안됨): TODO(E-MAIL), 완료 권한은 김은영선생님께?
    lists: [
      { charge: '임철수', name: 'KFC', price:0, method: '카드', proposed: '2022-11-30', due: '2022-12-15' },
      { charge: '임철수', name: '프린트박스', price:0, method: '카드', proposed: '2022-11-30', due: '2022-12-15' },
    ],
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Purchasing() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">물품구입관련</h1>
          <p className="mt-2 text-sm text-gray-700">
            구매목록.
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
                      In Charge
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Item
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Method
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Proposed
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Due
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {purchases.map((items) => (
                    <Fragment key={items.category}>
                      <tr className="border-t border-gray-200">
                        <th
                          colSpan={7}
                          scope="colgroup"
                          className="bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-gray-900 sm:px-6"
                        >
                          {items.category}
                        </th>
                      </tr>
                      {items.lists.map((item, itemIdx) => (
                        <tr
                          key={item.charge}
                          className={classNames(itemIdx === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {item.charge}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.price}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.method}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.proposed}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.due}</td>
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