import { RadioGroup } from '@headlessui/react'
import { useController } from "react-hook-form";

import { classNames } from '../libs/frontend/utils'

import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/20/solid';

export const RadioGroupStars = (props) => {
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
        <div className="flex flex-row-reverse justify-center gap-1">
          {[...items].reverse().map((item) => (
            <RadioGroup.Option
              key={item}
              value={item}
              className={({ active, checked }) =>
                classNames(
                  'cursor-pointer text-gray-200',
                  'flex-1 hover:text-yellow-600',
                  'peer',
                  'peer-hover:text-yellow-600 peer-checked:text-yellow-500',
                  active ? 'text-yellow-500' : '',
                  checked ? 'text-yellow-500' : '',
                  value >= item ? 'text-yellow-500' : '',
                )
              }
            >
              <RadioGroup.Label as={StarIconSolid} className='' />
              {/* {item} */}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>


      {/* <div className="flex flex-row-reverse justify-center gap-1"> */}
        {/* {items.map((item) => ( */}
        {/* MAPPING BREAKES PEER RELATIONSHIP due to the parent key parameter.*/}

        {/* <input type="radio" id={5} name="rating" value={5} className="hidden peer" />
        <label htmlFor={5}
          className="inline-flex items-center justify-between w-full p-5 text-gray-200 bg-white cursor-pointer 
           peer-hover:text-yellow-700 peer-checked:text-yellow-500
           hover:text-yellow-700">
          <StarIconSolid />5
        </label>
        <input type="radio" id={4} name="rating" value={4} className="hidden peer" />
        <label htmlFor={4}
          className="inline-flex items-center justify-between w-full p-5 text-gray-200 bg-white cursor-pointer 
           peer-hover:text-yellow-700 peer-checked:text-yellow-500
           hover:text-yellow-700">
          <StarIconSolid />
        </label>
        <input type="radio" id={3} name="rating" value={3} className="hidden peer" />
        <label htmlFor={3}
          className="inline-flex items-center justify-between w-full p-5 text-gray-200 bg-white cursor-pointer 
           peer-hover:text-yellow-700 peer-checked:text-yellow-500
           hover:text-yellow-700">
          <StarIconSolid />
        </label>
        <input type="radio" id={2} name="rating" value={2} className="hidden peer" />
        <label htmlFor={2}
          className="inline-flex items-center justify-between w-full p-5 text-gray-200 bg-white cursor-pointer 
           peer-hover:text-yellow-700 peer-checked:text-yellow-500
           hover:text-yellow-700">
          <StarIconSolid />
        </label>
        <input type="radio" id={1} name="rating" value={1} className="hidden peer" />
        <label htmlFor={1}
          className="inline-flex items-center justify-between w-full p-5 text-gray-200 bg-white cursor-pointer 
           peer-hover:text-yellow-700 peer-checked:text-yellow-500
           hover:text-yellow-700">
          <StarIconSolid />
        </label> */}


        {/* ))} */}
        {/* <input type="radio" id="hosting-small" name="hosting" value="hosting-small" className="hidden peer" />
          <label for="hosting-small"
            className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer 
           peer-checked:border-yellow-600 peer-checked:text-yellow-600 
           hover:text-gray-600 hover:bg-gray-100 ">
            <StarIconSolid /> 1
          </label>

          <input type="radio" id="hosting-big" name="hosting" value="hosting-big" className="hidden peer" />
          <label for="hosting-big"
            className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer  
          peer-checked:border-yellow-600 peer-checked:text-yellow-600 
           hover:text-gray-600 hover:bg-gray-100 ">
            <StarIconSolid /> 2
          </label> */}
      {/* </div> */}

    </>
  );
};