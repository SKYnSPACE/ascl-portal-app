import { RadioGroup } from '@headlessui/react'
import { useController } from "react-hook-form";

import { classNames } from '../libs/frontend/utils'

export const RadioGroupButtons = (props) => {
  const {
    field: { value, onChange }
  } = useController(props);

  const { items } = props;

  return (
    <>
      <RadioGroup
      value={value}
      onChange={onChange}
        className="w-full my-1">
        <RadioGroup.Label className="sr-only"> Choose a option </RadioGroup.Label>
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-4">
          {items.map((item) => (
            <RadioGroup.Option
              key={item}
              value={item}
              className={({ active, checked }) =>
                classNames( 
                  active ? 'ring-2 ring-offset-2 ring-pink-500' : '',
                  checked
                    ? 'bg-pink-600 border-transparent text-white hover:bg-pink-700'
                    : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50',
                    'cursor-pointer focus:outline-none',
                    'border rounded-md py-3 px-3 flex items-center justify-center text-sm uppercase sm:flex-1'
                )
              }
            >
              <RadioGroup.Label as="span">{item}</RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </>
  );
};