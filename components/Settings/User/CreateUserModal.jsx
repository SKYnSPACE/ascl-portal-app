import { useForm } from "react-hook-form";
// import { NumericFormat } from "react-number-format";
// import PhoneInput from 'react-phone-number-input'
import PhoneInput from "react-phone-number-input/react-hook-form-input"


import { Dialog } from "@headlessui/react";

import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

import useMutation from "../../../libs/frontend/useMutation";
import { useState, useEffect } from "react";

import { classNames } from '../../../libs/frontend/utils'

export default function CreateUserModal({ props }) {
  const { action, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage } = { ...props };

  const { register, control, handleSubmit, setError, reset } = useForm();
  const [createUser, { loading, data, error }] = useMutation("/api/settings/user/create");

  const onValid = (validForm) => {
    if (loading) return;
    createUser(validForm);
  }
  const onInvalid = () => {
  }

  useEffect(() => {
    if (data?.ok) {
      setMessage(
        { type: 'success', title: 'Successfully Saved!', details: 'New user created. Wait for the page reload.', }
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
        case 'P2002':
          console.log("Existing User.");
          setMessage(
            { type: 'fail', title: 'Creating user failed!', details: "User already exists. Or you may typed someone else's Email and phone number.", }
          )
          setIsNotify(true);
        default:
          console.log("ERROR CODE", data.error);
      }
    }

  }, [data])

  // useEffect(()=>{
  //   if(data?.error)
  //   {
  //     console.log("ERROR!")
  //   }
  // },[data])
  // useEffect(() => {
  //   console.log("ERROR!!", error);
  // }, [error])

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

          <form className="mt-5 flex flex-col items-center" onSubmit={handleSubmit(onValid)}>
            <div className="w-full">
              <label htmlFor="userNumber" className="text-sm">
                ID
              </label>
              <input
                {...register("userNumber", {
                  required: "ID is required.",
                  maxLength: {
                    message: "The ID must be less than 9 numbers.",
                    value: 9,
                  },
                })}
                type="number"
                name="userNumber"
                id="userNumber"
                placeholder="KAIST Student(Faculty) ID"
                required
                className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"
              />
            </div>

            <div className="w-full">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required.",
                  maxLength: {
                    message: "The Email must be less than 255 chars.",
                    value: 255,
                  },
                })}
                type="text"
                name="email"
                id="email"
                placeholder="@kaist.ac.kr account is preferred."
                required
                className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"

              />
            </div>

            <div className="w-full">
              <label htmlFor="phone" className="text-sm">
                Phone
              </label>
              {/* <input
                type="text"
                name="phone"
                id="phone"
                className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"
              /> */}
              <PhoneInput
                className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"
                // defaultCountry="KR" 
                country="KR"
                placeholder="Numbers Only!"
                name="phone"
                control={control}
                rules={{ required: true }}
              />
            </div>

            <div className="w-full">
              <label htmlFor="firstName" className="text-sm">
                Name (in English)
              </label>
              <div className="flex">
                <input
                  {...register("firstName", {
                    required: "First name is required.",
                    maxLength: {
                      message: "The name must be less than 64 chars.",
                      value: 64,
                    },
                  })}
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="First name"
                  required
                  className="my-1 mr-1 basis-2/3 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"
                />
                <input
                  {...register("lastName", {
                    required: "Last name is required.",
                    maxLength: {
                      message: "The name must be less than 64 chars.",
                      value: 64,
                    },
                  })}
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last name"
                  required
                  className="my-1 ml-1 basis-1/3 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"
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