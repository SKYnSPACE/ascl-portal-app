import { Fragment, useState, useEffect } from "react";
import useSWR from "swr";

import { format, parseISO } from "date-fns";

import {
  ArrowPathRoundedSquareIcon,
  BuildingLibraryIcon,
  BanknotesIcon,
  CpuChipIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  TruckIcon,
} from '@heroicons/react/20/solid'

import { classNames } from "../../../libs/frontend/utils";

export default function CpeBalance(props) {
  const { data, mutate, error, isLoading } = useSWR(props?.alias ? `/api/project/${props.alias}/cpe` : null);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (isLoading) return;
    if (data?.ok) {
      let transactions = [];
      // console.log(data.transactions)
      data.transactions?.map((transaction) => {
        if(transaction.relatedRequest)
        transactions.push(
          {
            id: transaction.id,
            item: transaction.payload6,
            icon: CpuChipIcon,
            href: '#',
            amount: `${(+transaction.payload9).toLocaleString()}`,
            currency: 'KRW',
            user: `${transaction.relatedRequest.payload2}`,
            date: `${format(parseISO(transaction.completedAt ? transaction.completedAt : '1990-02-26'), "LLL dd, yyyy")}`,
            datetime: transaction.completedAt,
          }
        )
        else 
        transactions.push(
          {
            id: transaction.id,
            item: transaction.payload6,
            icon: ArrowPathRoundedSquareIcon,
            href: '#',
            amount: `${(+transaction.payload9).toLocaleString()}`,
            currency: 'KRW',
            user: `${transaction.payload2}`,
            date: `${format(parseISO(transaction.completedAt ? transaction.completedAt : '1990-02-26'), "LLL dd, yyyy")}`,
            datetime: transaction.completedAt,
          }
        )
      })
      setTransactions(transactions);
    }
  }, [data])

  return (

    <div className="w-full">
      {/* <h2 className="mt-8 text-lg font-medium leading-6 text-gray-900">
      [재료비] Recent activities
    </h2> */}

      {/* Activity list (smallest breakpoint only) */}
      <div className="shadow sm:hidden">
        <ul role="list" className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden">
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <a href={transaction.href} className="block bg-white px-4 py-4 hover:bg-gray-50">
                <span className="flex items-center space-x-4">
                  <span className="flex flex-1 space-x-2 truncate">
                    <transaction.icon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <span className="flex flex-col truncate text-sm text-gray-500">
                      <span className="truncate">{transaction.item}</span>
                      <span>
                        <span className="font-medium text-gray-900">{transaction.amount}</span>{' '}
                        {transaction.currency}
                      </span>
                      <span className="text-gray-900">{transaction.user}
                      </span>
                      <time dateTime={transaction.datetime}>{transaction.date}</time>
                    </span>
                  </span>
                  <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <nav
          className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3"
          aria-label="Pagination"
        >
          <div className="flex flex-1 justify-between">
            <a
              href="#"
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Previous
            </a>
            <a
              href="#"
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Next
            </a>
          </div>
        </nav>
      </div>

      {/* Activity table (small breakpoint and up) */}
      <div className="hidden sm:block">
        <div className="">
          <div className="mt-2 flex flex-col">
            <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th
                      className="bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                      scope="col"
                    >
                      Transaction
                    </th>
                    <th
                      className="bg-gray-50 px-6 py-3 text-center text-sm font-semibold text-gray-900"
                      scope="col"
                    >
                      Amount
                    </th>
                    <th
                      className="hidden bg-gray-50 px-6 py-3 text-center text-sm font-semibold text-gray-900 md:block"
                      scope="col"
                    >
                      User
                    </th>
                    <th
                      className="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"
                      scope="col"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="bg-white">
                      <td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <div className="flex">
                          <a href={transaction.href} className="group inline-flex space-x-2 truncate text-sm">
                            <transaction.icon
                              className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                            <p className="truncate text-gray-500 group-hover:text-gray-900">
                              {transaction.item}
                            </p>
                          </a>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{transaction.amount}</span>{' '}
                        {transaction.currency}
                      </td>
                      <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-center text-gray-900 md:block">
                        <span>{transaction.user} 
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                        <time dateTime={transaction.datetime}>{transaction.date}</time>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <nav
                className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                aria-label="Pagination"
              >
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                    <span className="font-medium">20</span> results
                  </p>
                </div>

                <div className="flex flex-1 justify-between sm:justify-end">
                  <a
                    href="#"
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </a>
                  <a
                    href="#"
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}