import { useState, useEffect } from "react";
import useSWR from "swr";

import { useForm, Controller } from "react-hook-form";

import { Dialog } from "@headlessui/react";

import { CheckIcon, ExclamationCircleIcon, HomeIcon, LocationMarkerIcon, RefreshIcon, PlusIcon, PlusSmIcon, TrashIcon } from '@heroicons/react/24/outline';

import { NumericFormat } from 'react-number-format';
import useMutation from "../../libs/frontend/useMutation";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function PurchaseModal({ props }) {
  const { action, isModalOpen, setIsModalOpen } = { ...props };

  const { register, control, watch, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      projectAlias: null,
    },
  });

  const projectAlias = watch('projectAlias');

  const { data, mutate, error, isLoading } = useSWR(
    projectAlias ? `/api/purchase/${projectAlias}` :
      '/api/purchase');
      
  const [purchaseRequest, { loading: purchaseRequestLoading, data: purchaseRequestData, error: purchaseRequestError }] = useMutation("/api/request/purchase");

  // useEffect(() => { console.log(data) }, [data]);

  const onValid = (validForm) => {
    if (isLoading || purchaseRequestLoading) return;
    console.log(validForm);

    purchaseRequest(validForm);
  }
  const onInvalid = (errors) => {
    console.log(errors);
    // setMessage(
    //   {
    //     type: 'fail', title: 'Creating project failed.',
    //     details: `${Object.values(errors)[0]?.message}`,
    //   }
    // )
    // setIsNotify(true);
  }

  return (
    <Dialog
      as="div"
      className="fixed z-10 inset-0 overflow-y-auto"
      open={action.id == isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="flex items-end justify-center min-h-screen pt-32 px-4 pb-20 text-center sm:block">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-md sm:w-full sm:p-6">
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

          <form className="mt-3 flex flex-col items-center" onSubmit={handleSubmit(onValid, onInvalid)}>

            <div className="w-full">
              <label htmlFor="title" className="text-sm font-semibold">
                Account / Category
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">

                <input
                  type="text"
                  name="hidden"
                  id="hidden"
                  className="block w-full rounded-md border-gray-300 pl-24 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  disabled
                />


                <div className="absolute w-2/3 inset-y-0 left-0 flex items-center">
                  {data?.myProjects ?
                    <select
                      id="projectAlias"
                      name="projectAlias"
                      className="h-full w-full rounded-l-md border-transparent bg-transparent py-0 pl-3 pr-7 border-r-gray-300 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      defaultValue=""
                      required
                      {...register("projectAlias", {
                        required: "Project to edit is required.",
                      })}
                    >
                      <option value="" hidden></option>
                      {data?.myProjects?.map((item) => (<option key={item.alias} value={item.alias}>{item.title}</option>)
                      )}
                      <option value="INQUIRE">X. Inquire for the suitable account</option>

                    </select> : <></>}
                </div>

                <div className="absolute w-1/3 inset-y-0 right-0 flex items-center">

                  <select
                    id="category"
                    name="category"
                    autoComplete="category"
                    className="h-full w-full rounded-r-md border-transparent bg-transparent py-0 pl-2 pr-7 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    required
                    defaultValue=""
                    {...register("category", {
                      required: "Account category is required.",
                    })}
                  >
                    <option value="" hidden></option>
                    <option value="MPE">재료비</option>
                    <option value="CPE">전산처리비</option>
                    <option value="DTE">국내출장비</option>
                    <option value="OTE">해외출장비</option>
                    <option value="ME">회의비</option>
                    <option value="AE">수용비</option>
                    <option value="NS">X. Not sure</option>
                  </select>
                </div>
              </div>
            </div>


            <div className="w-full">
              <label htmlFor="item" className="text-sm font-semibold">
                Item / Qty.
              </label>

              <div className="grid grid-cols-3 border border-gray-300 rounded-md">
                <div className="border-r border-gray-300 col-span-2">

                  <input
                    {...register("item", {
                      required: "Item to purchase is required.",
                    })}
                    type="text"
                    name="item"
                    id="item"
                    className="block w-full border-transparent rounded-l-md  focus:border-sky-500 focus:ring-sky-500 text-sm"
                    placeholder="Item"
                    required
                  />


                </div>
                <div className="">
                  <Controller
                    control={control}
                    name="quantity"
                    rules={{ required: true }}
                    render={({ field: { onChange, name, value } }) => (
                      <NumericFormat
                        className="relative block w-full border-transparent rounded-r-md border-gray-300 bg-transparent focus:z-10 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                        placeholder="Quantity"
                        thousandSeparator=","
                        value={value}
                        required
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
              <label htmlFor="title" className="text-sm font-semibold">
                Payment Method / Total Price (Type the best estimate)
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">

                <input
                  type="text"
                  name="hidden"
                  id="hidden"
                  className="block w-full rounded-md border-gray-300 pl-24 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  disabled
                />

                <div className="absolute w-1/3 inset-y-0 left-0 flex items-center">
                  <select
                    {...register("paymentMethod", {
                      required: "Payment method is required.",
                    })}
                    id="paymentMethod"
                    name="paymentMethod"
                    autoComplete="paymentMethod"
                    className="h-full w-full rounded-l-md bg-transparent border-transparent border-r-gray-300 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    required
                    placeholder="test"
                    defaultValue=""
                  >
                    <option value="" hidden></option>
                    <option value="C">Credit Card</option>
                    <option value="T">Tax Invoice</option>
                    <option value="P">Purchasing Team</option>
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
                  name="totalPrice"
                  rules={{ required: true }}
                  render={({ field: { onChange, name, value } }) => (
                    <NumericFormat
                      className="absolute right-0 w-2/3 inset-y-0 flex items-center rounded-r-md border-gray-300 border-l-0 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      placeholder="Price"
                      suffix={" KRW"}
                      thousandSeparator=","
                      value={value}
                      // onChange={onChange} 
                      required
                      onValueChange={(target) => {
                        onChange();
                        setValue("totalPrice", target.floatValue);
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div className="w-full">
              <label htmlFor="details" className="text-sm font-semibold">
                Details (purpose, product descriptions, overseas, etc.)
              </label>
              <textarea
                {...register("details", {
                  required: "Purchase details field is empty.",
                  maxLength: {
                    message: "Maximum length of the details is 1000.",
                    value: 1000
                  }
                })}
                type="text"
                name="details"
                id="details"
                rows={3}
                required
                className="my-1 shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full border-gray-300 rounded-md text-sm"
                placeholder="Detailed information regarding the purchase. Purpose of this purchase? Product descriptions? Domestic/Overseas purchase? etc.?"
              />
            </div>

            <div className="w-full">
              <label htmlFor="requestFor" className="text-sm font-semibold">
                Approval
              </label>
              {data?.managers || data?.directors ?
                <select
                  {...register("requestFor", {
                    required: "Approval is required.",
                  })}
                  id="requestFor"
                  name="requestFor"
                  className="h-full w-full rounded-md bg-transparent border-gray-300 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  required
                  placeholder="test"
                  defaultValue=""
                >
                  <option value="" hidden></option>
                  {data?.managers?.map((manager) => {
                    return <option key={manager.id} value={manager.id}>Project Manager ({manager.name})</option>
                  })}
                  {data?.directors?.map((director) => {
                    switch (director.position) {
                      case 3:
                        return <option key={director.id} value={director.id}>Account Manager ({director.name})</option>
                      case 4:
                        return <option key={director.id} value={director.id}>Team Leader ({director.name})</option>
                      case 5:
                        return <option key={director.id} value={director.id}>Lab. Manager ({director.name})</option>
                      case 6:
                        return <option key={director.id} value={director.id}>Secretary ({director.name})</option>
                      case 7:
                        return <option key={director.id} value={director.id}>Professor ({director.name})</option>
                    }
                  })}
                </select> :
                <></>}
            </div>



            <div className="mt-5 sm:mt-6">
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#2980b9] text-base font-medium text-white hover:bg-[#aacae6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] sm:text-sm"
                type="submit"
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

          </form>



        </div>
      </div>
    </Dialog>

  );
}