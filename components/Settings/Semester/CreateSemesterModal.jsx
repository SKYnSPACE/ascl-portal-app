import { RadioGroup } from '@headlessui/react'

import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import PhoneInput from "react-phone-number-input/react-hook-form-input"


import { Dialog } from "@headlessui/react";

import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

import useMutation from "../../../libs/frontend/useMutation";
import { useState, useEffect } from "react";

import { classNames } from '../../../libs/frontend/utils'
import { RadioGroupButtons } from '../../RadioGroupButtons';

const currentYear = new Date().getFullYear();

const seasons = ['spring', 'summer', 'fall', 'winter'];

export default function CreateSemesterModal({ props }) {
  const { action, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage } = { ...props };

  const { register, control, handleSubmit , reset } = useForm({
    defaultValues: {
      year: currentYear,
      season: 'spring',
      doctors: 0,
      doctorCandidates: 0,
      masterCandidates: 0,
    },
  });
  const [createSemester, { loading, data, error }] = useMutation("/api/settings/semester/create");


  const onValid = (validForm) => {
    if (loading) return;
    // console.log(validForm)
    createSemester(validForm);
  }
  const onInvalid = (errors) => {
    if (errors?.year?.message) {
      setMessage(
        { type: 'fail', title: 'Invalid Form.', details: `${errors?.year?.message}`, }
      )
      setIsNotify(true);
    }

  }

  useEffect(() => {
    if (data?.ok) {
      setMessage(
        { type: 'success', title: 'Successfully Saved!', details: 'New semester created. Wait for the page reload.', }
      )
      setIsNotify(true);
      reset();
      setIsModalOpen(false);
    }

    if (data?.error) {
      switch (data.error?.code) {
        case 'P1017':
          console.log("Connection Lost.")
          setMessage(
            { type: 'fail', title: 'Connection Lost.', details: "Database Server does not respond.", }
          )
          setIsNotify(true);
          return;
        case 'P2002':
          console.log("Existing User.");
          setMessage(
            { type: 'fail', title: 'Creating semester failed!', details: "Semester already exists.", }
          )
          setIsNotify(true);
          return;
        default:
          console.log("ERROR CODE", data.error);
      }
    }

  }, [data])

  // useEffect(()=>{
  //   console.log(errors)
  // },[errors])

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
              <label htmlFor="year" className="text-sm">
                Year
              </label>
              <input
                {...register("year", {
                  required: "Year is required.",
                  minLength: {
                    message: "Year must be 4 digits.",
                    value: 4,
                  },
                  maxLength: {
                    message: "Year must be 4 digits.",
                    value: 4,
                  },
                })}
                type="number"
                name="year"
                id="year"
                required
                className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"
              />
            </div>

            <div className="w-full">
              <label htmlFor="season" className="text-sm">
                Season
              </label>
              <RadioGroupButtons name="season" control={control} items={seasons} />
            </div>

            <div className="w-full">
              <label htmlFor="doctors" className="text-sm">
                Personnel (포닥/ 박사과정/ 석사과정)
              </label>
              <div className="grid grid-cols-3 gap-1">
                <input
                  {...register("doctors", {
                    valueAsNumber: true,
                    required: "Post doctors field empty.",
                  })}
                  type="number"
                  name="doctors"
                  id="doctors"
                  placeholder='Post'
                  required
                  className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"
                />
                <input
                  {...register("doctorCandidates", {
                    valueAsNumber: true,
                    required: "Doctor candidates field empty.",
                  })}
                  type="number"
                  name="doctorCandidates"
                  id="doctorCandidates"
                  placeholder='PhD Candidates'
                  required
                  className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"
                />
                <input
                  {...register("masterCandidates", {
                    valueAsNumber: true,
                    required: "Master candidates field empty.",
                  })}
                  type="number"
                  name="masterCandidates"
                  id="masterCandidates"
                  placeholder='Master Candidates'
                  required
                  className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"
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
                  : <span>Confirm</span>}
              </button>
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] text-sm"
                onClick={(e) => {
                  reset();
                  setIsModalOpen(false);
                }}>
                Cancel
              </button>
            </div>

          </form>



        </div>
      </div>

      {/* <CustomModal props={{ popup: popups[0], isResultModalOpen, setIsResultModalOpen }} /> */}

    </Dialog>

  );
}