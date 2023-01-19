import { useEffect, useState, Fragment } from 'react'
import { useController } from "react-hook-form";

import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ComboBoxControlled(props) {
  const {
    field: { value, onChange }
  } = useController(props);

  const { items } = props;

  const [query, setQuery] = useState('')
  const filteredList =
    query === ''
      ? items
      : items.filter((item) => {
        return item.toLowerCase().includes(query.toLowerCase())
      })

  // useEffect(()=>{console.log(items)},[items])

  return (
    <Combobox as="div" value={value} onChange={onChange}>
      {/* <Combobox.Label className="block text-m font-medium text-gray-700">Assigned to</Combobox.Label> */}
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 text-m"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(item) => item}
          placeholder="Select Item"
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredList.length > 0 && (
          <Combobox.Options 
          // as="div"
          className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-m">
            {filteredList.map((item) => (
              <Combobox.Option
                key={item}
                value={item}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-sky-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={classNames('block truncate', selected && 'font-semibold')}>{item}</span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-sky-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}