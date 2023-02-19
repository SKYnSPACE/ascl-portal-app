// TODO: onClicked Requested list
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Dialog } from "@headlessui/react";

import { format, parseISO } from "date-fns";

import { useForm, Controller } from "react-hook-form";


import {
  CheckIcon, XMarkIcon, PencilSquareIcon,
  CreditCardIcon, HandThumbUpIcon, UserIcon
} from '@heroicons/react/20/solid'


import useMutation from "../../../../libs/frontend/useMutation";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const PayMethods = {
  C: "카드결제",
  T: "세금계산서",
  P: "구매팀",
}
const Categories = {
  MPE: "재료비",
  CPE: "전산처리비",
  DTE: "국내출장비",
  OTE: "해외출장비",
  ME: "회의비",
  AE: "수용비",
  NS: "지정요망",
}

export default function PurchaseRequestProcessingModal({ props }) {
  const { modal, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage, selectedRequest } = { ...props };
  const { data, mutate, error, isLoading } = useSWR(selectedRequest?.relatedAction?.id ? `/api/action/${selectedRequest.relatedAction.id}` : null);

  const [completeRequest, { loading: completeRequestLoading, data: completeRequestData, error: completeRequestError }] = useMutation("/api/workspace/purchasing/complete");

  const [feed, setFeed] = useState([
    {
      id: 0,
      content: 'No Feeds Yet.',
      user: 'Administrator',
      href: '#',
      date: 'Feb 26',
      datetime: '1990-02-26',
      icon: UserIcon,
      iconBackground: 'bg-gray-400',
    },
  ]);

  const onClickCompleted = (id) => {
    if (!id) return;
    if (isLoading || completeRequestLoading) return;

    completeRequest({ requestId: id, notify: false })
  }

  useEffect(() => {
    if (isLoading) return;

    if (data?.ok && data?.relatedAction) {
      let feed = [{
        id: 1,
        content: `Purchase granted: ${data.relatedAction.payload4} / ${Categories[data.relatedAction.payload5]}`,
        user: `${data.relatedAction.payload2}`,
        href: '#',
        date: selectedRequest.decidedDate,
        datetime: selectedRequest.decidedDatetime,
        icon: PencilSquareIcon,
        iconBackground: 'bg-blue-500',
      }];
      if (data.relatedAction.status == 1) {
        feed.push({
          id: 2,
          content: `Completed purchasing process: ${data.relatedAction.payload11} / ${(+data.relatedAction.payload9).toLocaleString()} KRW`,
          user: `${selectedRequest.name}`,
          href: '#',
          date: `${format(parseISO(data.relatedAction.completedAt ? data.relatedAction.completedAt : '1990-02-26'), "LLL dd, yyyy")}`,
          datetime: `${format(parseISO(data.relatedAction.completedAt ? data.relatedAction.completedAt : '1990-02-26'), "yyyy-MM-dd")}`,
          icon: CreditCardIcon,
          iconBackground: 'bg-blue-500',
        });
      }
      setFeed(feed)
    }

    if (data?.error) {
      setMessage(
        { type: 'fail', title: `${data.error?.code}`, details: `${data.error?.message}`, }
      )
      setIsNotify(true);
      reset();
    }
  }, [data]);

  useEffect(() => {
    if (completeRequestData?.ok) {
      setMessage(
        { type: 'success', title: 'Successfully Completed!', details: 'Wait for the page reload.', }
      )
      setIsNotify(true);
      setIsModalOpen(false);
    }
    if (completeRequestData?.error) {
      switch (completeRequestData.error?.code) {
        case 'P1017':
          console.log("Connection Lost.")
          setMessage(
            { type: 'fail', title: 'Connection Lost.', details: "Database Server does not respond.", }
          )
          setIsNotify(true);
          return;
        case 'P2002':
          console.log("Existing Data.");
          setMessage(
            { type: 'fail', title: 'Creating data failed!', details: "Data conflict.", }
          )
          setIsNotify(true);
          return;
        default:
          setMessage(
            { type: 'fail', title: `${completeRequestData.error.code}`, details: `${completeRequestData.error.message}`, }
          )
          setIsNotify(true);
          return;
      }
    }
  }, [completeRequestData]);


  const statusStyles = {
    pending: 'bg-sky-50 text-sky-700',
    processing: 'bg-yellow-50 text-yellow-700', //accepted, yet incomplete
    completed: 'bg-green-50 text-green-700',
    delayed: 'bg-red-50 text-red-700',
    declined: 'bg-gray-50 text-gray-700',
  }

  return (
    <Dialog
      as="div"
      className="fixed z-10 inset-0 overflow-y-auto"
      open={(modal.kind == isModalOpen.kind && modal.status == isModalOpen.status)}
      onClose={() => setIsModalOpen({})}
    >
      <div className="flex items-end justify-center min-h-screen pt-20 px-4 pb-20 text-center sm:block">
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

          <div className="mt-3 text-center">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium text-gray-900"
            >
              {modal.name}
            </Dialog.Title>
          </div>
          <Dialog.Description className="mt-4">
            {/* {modal.detail} */}
          </Dialog.Description>

          <div className="flex flex-col items-center">

            <div className="w-full overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="px-4 py-3 sm:px-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{selectedRequest?.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{selectedRequest?.name}</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-2 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">

                  {/* <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Requested by(신청인)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.name}</dd>
                  </div> */}
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Category(세목)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{Categories[selectedRequest?.category]}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Item/Qty.(품목/수량)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.item} / x{selectedRequest?.quantity}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Details(상세)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.details}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Total Price(총액)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.amount}{selectedRequest?.currency} ({PayMethods[selectedRequest?.payMethod]})</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Due(처리기한)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.date}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Inspection(검수서류)</dt>
                    {data?.relatedAction?.status == 1 ?
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0 flex itemc-center justify-between">구입사실 및 검사확인서

                      <a href={`/exports/${data?.relatedAction?.payload3}-${data?.relatedAction?.id}.docx`}
                        className="font-medium text-sky-600 hover:text-sky-500"
                        download={`구입사실 및 검사(수령)확인서-${selectedRequest?.name}-자동생성.docx`}>
                        Download
                      </a>
                    </dd>: 
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0 flex itemc-center justify-between">
                      구매절차 진행중...
                  </dd>}
                  </div>

                </dl>
              </div>
            </div>

            <div className="flow-root mt-4 w-full px-2">
              <ul role="list" className="-mb-8">
                {feed.map((event, eventIdx) => (
                  <li key={event.id}>
                    <div className="relative pb-5">
                      {eventIdx !== feed.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={classNames(
                              event.iconBackground,
                              'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                            )}
                          >
                            <event.icon className="h-5 w-5 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4">
                          <div>
                            <a href={event.href} className="text-sm font-medium text-gray-900">
                              {event.user}
                            </a>
                            <p className="text-sm text-gray-500">
                              {event.content}{' '}
                              {/* <a href={event.href} className="font-medium text-gray-900">
                                {event.user}
                              </a> */}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime={event.datetime}>{event.date}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>




            {isNotify ? <div className="w-full mt-2">
              <p className="text-xs text-red-600">{message.details}</p>
            </div> : <></>}
            <div className="mt-8">

              {data?.relatedAction?.status == 1 ?
                <button
                  className="mx-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-500 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm"
                  disabled={completeRequestLoading}
                  onClick={(e) => {
                    onClickCompleted(selectedRequest?.id);

                  }}

                >
                  {completeRequestLoading ?
                    <span className="flex items-center text-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>processing...</span>
                    : <span>Complete</span>}

                </button>
                : <></>}




              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] text-sm"
                onClick={(e) => {
                  // reset();
                  setIsModalOpen(false);
                }}>
                Close
              </button>
            </div>

          </div>



        </div>
      </div>
    </Dialog>

  );
}