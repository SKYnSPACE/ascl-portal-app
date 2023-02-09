import { useState, useEffect } from "react";
import useSWR from "swr";

import { useForm, Controller } from "react-hook-form";

import { Dialog } from "@headlessui/react";

import {
  ArrowLongRightIcon,
  CheckIcon, ExclamationCircleIcon, HomeIcon, LocationMarkerIcon, RefreshIcon, PlusIcon, PlusSmIcon, TrashIcon
} from '@heroicons/react/24/outline';

import { NumericFormat } from 'react-number-format';
import useMutation from "../../libs/frontend/useMutation";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function BusinessTripModal({ props }) {
  const { action, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage } = { ...props };

  const { register, control, watch, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      projectAlias: null,
    },
  });

  const projectAlias = watch('projectAlias');
  const category = watch('category');

  const { data, mutate, error, isLoading } = useSWR(
    projectAlias ? `/api/businessTrip/${projectAlias}` :
      '/api/businessTrip');

  const [tripRequest, { loading: tripRequestLoading, data: tripRequestData, error: tripRequestError }] = useMutation("/api/request/businessTrip");

  // useEffect(() => { console.log(data) }, [data]);
  useEffect(() => {
    if(tripRequestLoading) return;
    if (tripRequestData?.ok) {
      setMessage(
        { type: 'success', title: 'Successfully Sent!', details: 'Business trip request completed. Wait for the page reload.', }
      )
      setIsNotify(true);
      reset();
      setIsModalOpen(false);
    }
    if (tripRequestData?.error) {
      switch (tripRequestData.error?.code) {
        case '403':
          setMessage(
            { type: 'fail', title: 'Not allowed.', details: `${tripRequestData.error?.message}`, }
          )
          setIsNotify(true);
          return;
        default:
          console.log("ERROR", data.error);
          setMessage(
            { type: 'fail', title: `${tripRequestData.error?.code}`, details: `${tripRequestData.error?.message}`, }
          )
          setIsNotify(true);
          return;
      }
    }
  },[tripRequestData]);

  const onValid = (validForm) => {
    if (isLoading || false) return;
    if (endDate < startDate) {
      setMessage(
        { type: 'fail', title: 'Sending request failed.', details: `Invalid starts/ends date range`, }
      )
      setIsNotify(true);
      return;
    }

    console.log(validForm);
    tripRequest(validForm);
  }
  const onInvalid = (errors) => {
    console.log(errors);
    setMessage(
      {
        type: 'fail', title: 'Request failed.',
        details: `${Object.values(errors)[0]?.message}`,
      }
    )
    setIsNotify(true);
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
              <div className="flex justify-between">
                <label htmlFor="title" className="text-sm font-semibold">
                  Account / Category
                </label>
                {data?.selectedProject ?
                  <div className="text-right text-sm">
                    <p className="text-gray-400">
                      Balance:&nbsp;
                      {category == "DTE" ? `${data.selectedProject.dteBalance.toLocaleString()}` :
                        category == "OTE" ? `${data.selectedProject.oteBalance.toLocaleString()}` : "?"}
                      KRW
                    </p>
                  </div> :
                  <></>}
              </div>
              <div className="relative mt-1 rounded-md shadow-sm">

                <input
                  type="text"
                  name="hidden"
                  id="hidden"
                  className="block w-full rounded-md border-gray-300 pl-24 focus:border-sky-500 focus:ring-sky-500 text-sm"
                  disabled
                />


                <div className="absolute w-2/3 inset-y-0 left-0 flex items-center">
                  {data?.myProjects ?
                    <select
                      id="projectAlias"
                      name="projectAlias"
                      className="h-full w-full rounded-l-md border-transparent bg-transparent py-0 pl-3 pr-7 border-r-gray-300 focus:border-sky-500 focus:ring-sky-500 text-sm"
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
                    className="h-full w-full rounded-r-md border-transparent bg-transparent py-0 pl-2 pr-7 focus:border-sky-500 focus:ring-sky-500 text-sm"
                    required
                    defaultValue=""
                    {...register("category", {
                      required: "Account category is required.",
                    })}
                  >
                    <option value="" hidden></option>
                    <option value="DTE">Domestic</option>
                    <option value="OTE">Overseas</option>
                  </select>
                </div>
              </div>
            </div>


            <div className="w-full">
              <label htmlFor="item" className="text-sm font-semibold">
                Destination / Expense (optional, give the best estimate)
              </label>

              <div className="grid grid-cols-2 border border-gray-300 rounded-md">
                <div className="border-r border-gray-300 col-span-1">

                  <input
                    {...register("destination", {
                      required: "Destination is required.",
                    })}
                    type="text"
                    name="destination"
                    id="destination"
                    className="block w-full border-transparent rounded-l-md  focus:border-sky-500 focus:ring-sky-500 text-sm"
                    placeholder="Destination"
                    required
                  />


                </div>
                <div className="">


                  <Controller
                    control={control}
                    name="expense"
                    // rules={{ required: true }}
                    render={({ field: { onChange, name, value } }) => (
                      <NumericFormat
                        className="relative block w-full border-transparent rounded-r-md border-gray-300 bg-transparent focus:z-10 focus:border-sky-500 focus:ring-sky-500 text-sm"
                        placeholder="Expense (optional)"
                        suffix={" KRW"}
                        thousandSeparator=","
                        value={value}
                        onValueChange={(target) => {
                          onChange();
                          setValue("expense", target.floatValue);
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="w-full mt-1">
              <label htmlFor="startDate" className="text-sm font-semibold">
                Starts / Ends
              </label>
              <div className="flex items-center">
                <input
                  {...register("startDate", {
                    required: "Start date is required.",
                  })}
                  type="date"
                  name="startDate"
                  id="startDate"
                  required
                  className="my-1 shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full border-gray-300 rounded-md text-sm"

                />
                <ArrowLongRightIcon className="h-12 w-12 mx-2 text-gray-500" />

                <input
                  {...register("endDate", {
                    required: "End date is required.",
                  })}
                  type="date"
                  name="endDate"
                  id="endDate"
                  required
                  className="my-1 shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full border-gray-300 rounded-md text-sm"

                />
              </div>
            </div>

            <div className="w-full">
              <label htmlFor="details" className="text-sm font-semibold">
                Details (purpose, notes, etc.)
              </label>
              <textarea
                {...register("details", {
                  required: "Details field is empty.",
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
                placeholder="Detailed information regarding the Business Trip. Purpose of this trip? Anything to note? etc.?"
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
                  className="h-full w-full rounded-md bg-transparent border-gray-300 focus:border-sky-500 focus:ring-sky-500 text-sm"
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


            {isNotify ? <div className="w-full mt-2">
              <p className="text-xs text-red-600">{message.details}</p>
            </div> : <></>}
            <div className="mt-5 sm:mt-6">
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#2980b9] font-medium text-white hover:bg-[#aacae6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] text-sm"
                type="submit"
              >

                {tripRequestLoading ?
                  <span className="flex items-center text-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>processing...</span>
                  : <span>Send</span>}

              </button>
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] text-sm"
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