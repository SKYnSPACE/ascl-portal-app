import { useState, useEffect } from "react";
import useSWR from "swr";

import { useForm, Controller } from "react-hook-form";

import { Dialog } from "@headlessui/react";

import { CheckIcon, ExclamationCircleIcon, HomeIcon, LocationMarkerIcon, RefreshIcon, PlusIcon, PlusSmIcon, TrashIcon } from '@heroicons/react/24/outline';

import { NumericFormat } from 'react-number-format';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function PurchaseModal({props}) {
  const {action, isModalOpen, setIsModalOpen} = {...props};

  const { register, control, watch, handleSubmit, setValue, reset } = useForm({});

  return (
    <Dialog
      as="div"
      className="fixed z-10 inset-0 overflow-y-auto"
      open={action.id == isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="flex items-end justify-center min-h-screen pt-32 px-4 pb-20 text-center sm:block">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div className={classNames("mx-auto flex items-center justify-center h-12 w-12 rounded-full", action.iconBackground)}>

            <action.icon
              className={classNames("h-6 w-6", action.iconForeground)}
              aria-hidden="true"
            />
          </div>

          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              {action.name}
            </Dialog.Title>
          </div>
          <Dialog.Description className="mt-4">
            {action.detail}
          </Dialog.Description>

          <div className="mt-5 flex flex-col items-center">
            <div className="w-full">
              <label htmlFor="account" className="text-sm font-semibold">
                Account
              </label>
              <input
                type="text"
                name="account"
                id="account"
                className="my-1 shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full border-gray-300 rounded-md text-sm"

              />
            </div>

            <div className="w-full">
              <label htmlFor="item" className="text-sm font-semibold">
                Item / Qty.
              </label>

              <div className="grid grid-cols-3 border border-gray-300 rounded-md">
                <div className="border-r border-gray-300 col-span-2">

                <input
                  {...register("alias", {
                    required: "Account number is required.",
                    minLength: {
                      value: 9,
                      message: "Project code length should be 9.",
                    },
                    maxLength: {
                      value: 9,
                      message: "Project code length should be 9.",
                    },
                    pattern: {
                      value: /^[G|N]{1}\d{8}/,
                      message: "Invalid project code. It should be /^[G|N]{1}\d{8}/"
                    }
                  }
                  )}
                  type="text"
                  name="alias"
                  id="alias"
                  className="block w-full border-transparent rounded-l-md  focus:border-sky-500 focus:ring-sky-500 text-sm"
                  required
                  onChange={(e) => { e.target.value = e.target.value.toUpperCase() }}
                />


                </div>
                <div className="">
                  <Controller
                    control={control}
                    name="quantity"
                    render={({ field: { onChange, name, value } }) => (
                      <NumericFormat
                        className="relative block w-full border-transparent rounded-r-md border-gray-300 bg-transparent focus:z-10 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                        placeholder="Quantity"
                        thousandSeparator=","
                        value={value}
                        // onChange={onChange} 
                        onValueChange={(target) => {
                          onChange();
                          setValue("quantity", target.floatValue);
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              
            </div>

            <div className="w-full">
              <label htmlFor="details" className="text-sm font-semibold">
                Details
              </label>
              <textarea
                type="text"
                name="details"
                id="details"
                className="my-1 shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full border-gray-300 rounded-md text-sm"
                placeholder="Detailed information regarding the purchase."
              />
            </div>

            <div className="w-full">
              <label htmlFor="title" className="text-sm font-semibold">
                Payment method / Price
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <label htmlFor="type" className="sr-only">
                    Account Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    autoComplete="type"
                    className="h-full rounded-l-md border-transparent bg-transparent py-0 pl-3 pr-8 border-r-gray-300 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    required
                    placeholder="test"
                    defaultValue=""
                  >
                    <option value="" hidden></option>
                    <option value="C">Credit Card</option>
                    <option value="T">Tax Invoice</option>
                    <option value="P">PR</option>
                  </select>
                </div>
                {/* <input
                  type="text"
                  name="alias"
                  id="alias"
                  className="block w-full rounded-md border-gray-300 pl-32 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  required
                /> */}
                <Controller
                      control={control}
                      name="cpePlanned"
                      render={({ field: { onChange, name, value } }) => (
                        <NumericFormat
                          className="block w-full rounded-md border-gray-300 pl-32 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                          placeholder="Price"
                          suffix={" KRW"}
                          thousandSeparator=","
                          value={value}
                          // onChange={onChange} 
                          onValueChange={(target) => {
                            onChange();
                            setValue("cpePlanned", target.floatValue);
                          }}
                        />
                      )}
                    />
              </div>
            </div>

            

            <div className="w-full">
              <label htmlFor="approval" className="text-sm font-semibold">
                Approval
              </label>
              <input
                type="text"
                name="approval"
                id="approval"
                className="my-1 shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full border-gray-300 rounded-md"

              />
            </div>



            <div className="mt-5 sm:mt-6">
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#2980b9] text-base font-medium text-white hover:bg-[#aacae6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] sm:text-sm"
                onClick={(e) => {}}
              >
                Send
              </button>
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9]   sm:text-sm"
                onClick={(e) => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>

          </div>



        </div>
      </div>
    </Dialog>

  );
}