// TODO: onClicked Requested list
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Dialog } from "@headlessui/react";

import { format, parseISO } from "date-fns";

import {
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

import useMutation from "../../../libs/frontend/useMutation";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function PurchaseRequestModal({ props }) {
  const { modal, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage, selectedRequest } = { ...props };

  const [acceptRequest, { loading: acceptRequestLoading, data: acceptRequestData, error: acceptRequestError }] = useMutation("/api/request/accept");
  const [declineRequest, { loading: declineRequestLoading, data: declineRequestData, error: declineRequestError }] = useMutation("/api/request/decline");

  // useEffect(()=>{
  //   console.log(isModalOpen?.pid)
  //   if(data?.seminar){
  //   console.log(data.seminar);
  //   }
  // },[data]);


  const statusIcons = {
    pending: QuestionMarkCircleIcon,
    processing: PencilSquareIcon,
    completed: CheckCircleIcon,
    delayed: ExclamationTriangleIcon,
    declined: XCircleIcon,
  }

  const statusStyles = {
    pending: 'bg-sky-50 text-sky-700',
    processing: 'bg-yellow-50 text-yellow-700', //accepted, yet incomplete
    completed: 'bg-green-50 text-green-700',
    delayed: 'bg-red-50 text-red-700',
    declined: 'bg-gray-50 text-gray-700',
  }

  const onClickAccept = (id) => {
    if (!id) return;
    acceptRequest({ requestId: id })
  }

  const onClickDecline = (id) => {
    if (!id) return;
    declineRequest({ requestId: id })
  }

  useEffect(() => {
    if (acceptRequestData?.ok) {
      setMessage(
        { type: 'success', title: 'Accepted!', details: 'Thank you for your decision. Wait for the page reload.', }
      )
      setIsNotify(true);
      setIsModalOpen(false);
    }

    if (acceptRequestData?.error) {
      switch (acceptRequestData.error?.code) {
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
            { type: 'fail', title: 'Creating user failed!', details: "User already exists. Or you may typed someone else's Email and phone number.", }
          )
          setIsNotify(true);
          return;
        default:
      }
    }

  }, [acceptRequestData])

  useEffect(() => {
    if (declineRequestData?.ok) {
      setMessage(
        { type: 'success', title: 'Successfully Declined!', details: ' Wait for the page reload.', }
      )
      setIsNotify(true);
      setIsModalOpen(false);
    }

    if (declineRequestData?.error) {
      switch (declineRequestData.error?.code) {
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
            { type: 'fail', title: 'Creating user failed!', details: "User already exists. Or you may typed someone else's Email and phone number.", }
          )
          setIsNotify(true);
          return;
        default:
      }
    }

  }, [declineRequestData])

  return (
    <Dialog
      as="div"
      className="fixed z-10 inset-0 overflow-y-auto"
      open={modal.id == isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="flex items-end justify-center min-h-screen pt-32 px-4 pb-20 text-center sm:block">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg sm:w-full sm:p-6">
          <div className={classNames("mx-auto flex items-center justify-center h-12 w-12 rounded-full", statusStyles[selectedRequest.status])}>
            {selectedRequest?.icon ?
              <selectedRequest.icon
                className={classNames("h-6 w-6")}
                aria-hidden="true"
              />
              : <></>}
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
            {/* {modal.detail} */}
          </Dialog.Description>

          <div className="mt-5 flex flex-col items-center">

            <div className="w-full overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="px-4 py-3 sm:px-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{selectedRequest?.title}</h3>
                {/* <p className="mt-1 text-sm text-gray-500">Category:{selectedRequest?.category} ---- Due: {selectedRequest?.date}</p> */}
              </div>
              <div className="border-t border-gray-200 px-4 py-2 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">

                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Requested by(신청인)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.name}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Category(세목)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.category}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Item/Qty.(품목/수량)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.item} / x{selectedRequest?.quantity}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Details(상세)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.details}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Total Price(총액)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.amount} {selectedRequest?.currency}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Due(처리기한)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.date}</dd>
                  </div>

                </dl>
              </div>
            </div>

            <div className="w-full">
              TODO: 계정정보 변경 필요한경우 입력 / 사이드노트(참고사항, 반려사유 등 기입) --&gt; useForm --&gt; createAction.
              (accept 처리 전에 create action api 실행할 것.)
              <br/>
              Message(Notes, cause of decline, etc.)
            </div>





            <div className="mt-5 sm:mt-6">
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm"
                disabled={acceptRequestLoading}
                onClick={(e) => {
                  onClickAccept(requestId);
                  // setIsModalOpen(false);
                }}

              >
                {acceptRequestLoading ?
                  <span className="flex items-center text-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>processing...</span>
                  : <span>Accept</span>}

              </button>


              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500   sm:text-sm"
                disabled={declineRequestLoading}
                onClick={(e) => {
                  onClickDecline(requestId);
                  // setIsModalOpen(false);
                }}
              >
                {declineRequestLoading ?
                  <span className="flex items-center text-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>processing...</span>
                  : <span>Decline</span>}

              </button>
            </div>

          </div>



        </div>
      </div>
    </Dialog>

  );
}