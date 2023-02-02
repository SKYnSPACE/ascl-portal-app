import { useState, useEffect } from "react";
import useSWR from "swr";

import { useForm, Controller } from "react-hook-form";

import { Dialog, RadioGroup } from "@headlessui/react";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";

import { NumericFormat } from 'react-number-format';

import useMutation from "../../../libs/frontend/useMutation";

import { classNames } from '../../../libs/frontend/utils'



const settings = [
  { name: 'UAV', description: '' },
  { name: 'BOTH', description: '' },
  { name: 'SAT', description: '' },
]

export default function CreateProjectModal({ props }) {
  const { action, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage } = { ...props };

  const { register, control, watch, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
    },
  });

  const { data: currentSemesterData, error: getCurrentSemesterError, isLoading: getCurrentSemesterLoading } = useSWR('/api/semester/current');

  const [createProject, { loading, data, error }] = useMutation("/api/settings/project/create");

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const [selected, setSelected] = useState(settings[0])

  const onValid = (validForm) => {
    if (loading) return;
    if (endDate <= startDate) {
      setMessage(
        { type: 'fail', title: 'Creating project failed.', details: `Invalid starts/ends date range`, }
      )
      setIsNotify(true);
      return;
    }

    console.log(validForm);
    createProject(validForm);
  }
  const onInvalid = (errors) => {
    console.log(errors);
    setMessage(
      {
        type: 'fail', title: 'Creating project failed.',
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
      <div className="flex items-end justify-center min-h-screen pt-12 px-4 pb-20 text-center sm:block">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
          <div className={classNames("mx-auto flex items-center justify-center h-12 w-12 rounded-full", action.iconBackground)}>

            <action.icon
              className={classNames("h-6 w-6", action.iconForeground)}
              aria-hidden="true"
            />
          </div>

          <div className="mt-1 text-center">
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
                Title
              </label>
              <input
                {...register("title", {
                  required: "Title is required.",
                })}
                type="text"
                name="title"
                id="title"
                required
                className="my-1 shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full border-gray-300 rounded-md text-sm"

              />
            </div>

            <div className="w-full">
              <label htmlFor="title" className="text-sm font-semibold">
                Account Type / Project Number
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <label htmlFor="type" className="sr-only">
                    Account Type
                  </label>
                  <select
                    {...register("type", {
                      required: "Account type is required.",
                    })}
                    id="type"
                    name="type"
                    autoComplete="type"
                    className="h-full rounded-l-md border-transparent bg-transparent py-0 pl-3 pr-8 border-r-gray-300 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    required
                    placeholder="test"
                    defaultValue=""
                  >
                    <option value="" hidden></option>
                    <option value="Y">정산</option>
                    <option value="Y/N">일부정산</option>
                    <option value="N">비정산</option>
                  </select>
                </div>
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
                  className="block w-full rounded-md border-gray-300 pl-28 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  placeholder="G00000000"
                  required
                  onChange={(e) => { e.target.value = e.target.value.toUpperCase() }}
                />
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
              <label htmlFor="title" className="text-sm font-semibold">
                Team in Charge / Project Scale (Include VAT)
              </label>




              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="text"
                  name="hidden"
                  id="hidden"
                  className="block w-full rounded-md border-gray-300 pl-24 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  disabled
                />

                <div className="absolute w-1/2 inset-y-0 left-0 flex items-center">
                  <select
                    {...register("teamInCharge", {
                      required: "Team in charge is required.",
                    })}
                    id="teamInCharge"
                    name="teamInCharge"
                    className="h-full w-full rounded-l-md border-transparent bg-transparent py-0 pl-3 pr-7 border-r-gray-300 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    defaultValue=""
                  >
                    <option value="" hidden></option>
                    <option value="all">ALL</option>
                    <option value="sat">SAT</option>
                    <option value="uav">UAV</option>
                  </select>
                </div>

                <div className="absolute w-1/2 inset-y-0 right-0 flex items-center">
                  <select
                    {...register("scale", {
                      required: "Project scale is required.",
                    })}
                    id="scale"
                    name="scale"
                    className="h-full w-full rounded-r-md border-transparent bg-transparent py-0 pl-2 pr-7 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    required
                    defaultValue=""
                  >
                    <option value="" hidden></option>
                    <option value={100}> &lt; 80M &#8361;/year</option>
                    <option value={200}> &lt; 160M &#8361;/year</option>
                    <option value={300}> &ge; 160M &#8361;/year</option>
                  </select>
                </div>
              </div>



            </div>


            <div className="w-full mt-2">
              <label className="text-sm font-semibold">
                Planned Costs [KRW]
              </label>

              <div className="mt-1 -space-y-px rounded-md bg-white shadow-sm">
                <div className="grid grid-cols-2 border border-gray-300 rounded-md">
                  <div className="border-r border-gray-300">
                    <Controller
                      control={control}
                      name="mpePlanned"
                      render={({ field: { onChange, name, value } }) => (
                        <NumericFormat
                          className="relative block w-full border-transparent rounded-tl-md border-gray-300 bg-transparent focus:z-10 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                          placeholder="재료비"
                          suffix={" KRW"}
                          thousandSeparator=","
                          value={value}
                          // onChange={onChange} 
                          onValueChange={(target) => {
                            onChange();
                            setValue("mpePlanned", target.floatValue);
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="">
                    <Controller
                      control={control}
                      name="cpePlanned"
                      render={({ field: { onChange, name, value } }) => (
                        <NumericFormat
                          className="relative block w-full border-transparent rounded-tr-md border-gray-300 bg-transparent focus:z-10 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                          placeholder="전산처리비"
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
                  <div className="border-r border-y border-gray-300">

                    <Controller
                      control={control}
                      name="dtePlanned"
                      render={({ field: { onChange, name, value } }) => (
                        <NumericFormat
                          className="relative block w-full rounded-none border-transparent border-gray-300 bg-transparent focus:z-10 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                          placeholder="국내출장비"
                          suffix={" KRW"}
                          thousandSeparator=","
                          value={value}
                          // onChange={onChange} 
                          onValueChange={(target) => {
                            onChange();
                            setValue("dtePlanned", target.floatValue);
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="border-y border-gray-300">


                    <Controller
                      control={control}
                      name="otePlanned"
                      render={({ field: { onChange, name, value } }) => (
                        <NumericFormat
                          className="relative block w-full rounded-none border-transparent border-gray-300 bg-transparent focus:z-10 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                          placeholder="국외출장비"
                          suffix={" KRW"}
                          thousandSeparator=","
                          value={value}
                          // onChange={onChange} 
                          onValueChange={(target) => {
                            onChange();
                            setValue("otePlanned", target.floatValue);
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="border-r border-gray-300">

                    <Controller
                      control={control}
                      name="mePlanned"
                      render={({ field: { onChange, name, value } }) => (
                        <NumericFormat
                          className="relative block w-full border-transparent rounded-bl-md border-gray-300 bg-transparent focus:z-10 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                          placeholder="회의비"
                          suffix={" KRW"}
                          thousandSeparator=","
                          value={value}
                          // onChange={onChange} 
                          onValueChange={(target) => {
                            onChange();
                            setValue("mePlanned", target.floatValue);
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="">
                    {/* <input
                      type="text"
                      name="aePlanned"
                      id="aePlanned"
                      className="relative block w-full rounded-none border-transparent rounded-br-md border-gray-300 bg-transparent focus:z-10 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      placeholder="수용비"
                    /> */}
                    <Controller
                      control={control}
                      name="aePlanned"
                      render={({ field: { onChange, name, value } }) => (
                        <NumericFormat
                          className="relative block w-full border-transparent rounded-br-md border-gray-300 bg-transparent focus:z-10 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                          placeholder="수용비"
                          suffix={" KRW"}
                          thousandSeparator=","
                          value={value}
                          // onChange={onChange} 
                          onValueChange={(target) => {
                            onChange();
                            setValue("aePlanned", target.floatValue);
                          }}
                        />
                      )}
                    />
                  </div>

                </div>
              </div>

              <div className="w-full mt-1">
                <label htmlFor="note" className="text-sm font-semibold">
                  Note (재료비 지출가능 항목 등 과제관련 참고사항 작성)
                </label>
                <textarea
                  {...register("note", {
                    required: "Note is required.",
                    maxLength: {
                      message: "Maximum length of the note is 500.",
                      value: 500
                    }
                  })}
                  type="text"
                  name="note"
                  id="note"
                  rows={2}
                  required
                  className="my-1 shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full border-gray-300 rounded-md text-sm"

                />
              </div>

            </div>


            {isNotify ? <div className="w-full mt-2">
              <p className="text-xs text-red-600">{message.details}</p>
            </div> : <></>}
            <div className="mt-5 sm:mt-6">
              <button
                className="group relative mx-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#2980b9] font-medium text-white hover:bg-[#aacae6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] text-sm"
                disabled={loading}
                type="submit"
              >
                {loading ?
                  <span className="flex items-center text-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>processing...</span>
                  : <span>Create</span>}
              </button>
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] text-sm"
                onClick={(e) => {
                  reset();
                  setIsModalOpen(false);
                }}>
                Close
              </button>
            </div>

          </form>



        </div >
      </div >

      {/* <CustomModal props={{ popup: popups[0], isResultModalOpen, setIsResultModalOpen }} /> */}

    </Dialog >

  );
}