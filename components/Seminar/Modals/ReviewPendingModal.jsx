// TODO: onClicked Requested list
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Dialog } from "@headlessui/react";

import {format, parseISO} from "date-fns";

import { CheckIcon, ExclamationCircleIcon, HomeIcon, LocationMarkerIcon, RefreshIcon, PlusIcon, PlusSmIcon, TrashIcon } from '@heroicons/react/24/outline';

import useMutation from "../../../libs/frontend/useMutation";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ReviewPendingModal({props}) {
  const {modal, isModalOpen, setIsModalOpen, requestId, seminarData} = {...props};

  const [declineRequest, { loading: declineRequestLoading, data: declineRequestData, error: declineRequestError }] = useMutation("/api/request/decline");

  
  // useEffect(()=>{
  //   console.log(isModalOpen?.pid)
  //   if(data?.seminar){
  //   console.log(data.seminar);
  //   }
  // },[data]);

  const onClickDecline = (id) => {
    if(!id) return;
    declineRequest({ requestId: id })
  }

  return (
    <Dialog
      as="div"
      className="fixed z-10 inset-0 overflow-y-auto"
      open={modal.id == isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="flex items-end justify-center min-h-screen pt-32 px-4 pb-20 text-center sm:block">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6">
          <div className={classNames("mx-auto flex items-center justify-center h-12 w-12 rounded-full", modal.iconBackground)}>

            <modal.icon
              className={classNames("h-6 w-6", modal.iconForeground)}
              aria-hidden="true"
            />
          </div>

          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              {modal.name}
            </Dialog.Title>
          </div>
          <Dialog.Description className="mt-4">
            {modal.detail}
          </Dialog.Description>

          <div className="mt-5 flex flex-col items-center">

          <div className="w-full overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-3 sm:px-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{seminarData?.title}</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{seminarData?.tags}</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-2 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-2 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-4 sm:py-3">
            <dt className="text-sm font-medium text-gray-500">Presenter</dt>
            <dd className="mt-0 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{seminarData?.presentedBy?.name}</dd>
          </div>
          <div className="py-2 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-4 sm:py-3">
            <dt className="text-sm font-medium text-gray-500">Category</dt>
            <dd className="mt-0 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{seminarData?.category}</dd>
          </div>
          <div className="py-2 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-4 sm:py-3">
            <dt className="text-sm font-medium text-gray-500">Last Modified</dt>
            <dd className="mt-0 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{seminarData?.updatedAt? format(parseISO(seminarData?.updatedAt),"yyyy-MM-dd HH:mm:ss") : "" }</dd>
          </div>
          <div className="py-2 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-4 sm:py-3">
            <dt className="text-sm font-medium text-gray-500">Abstract</dt>
            <dd className="mt-0 text-sm text-gray-900 sm:col-span-3 sm:mt-0">
            {seminarData?.abstract}
            </dd>
          </div>
          
        </dl>
      </div>
      </div>


           


            <div className="mt-5 sm:mt-6">
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm"
                onClick={(e) => {}}
              >
                Accept
              </button>
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500   sm:text-sm"
                onClick={(e) => {
                  onClickDecline(requestId);
                  setIsModalOpen(false);
                }}
              >
                Decline
              </button>
            </div>

          </div>



        </div>
      </div>
    </Dialog>

  );
}