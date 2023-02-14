// TODO: onClicked Requested list
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Dialog } from "@headlessui/react";

import { format, parseISO } from "date-fns";

import { useForm, Controller } from "react-hook-form";

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

export default function TripRequestPendingModal({ props }) {
  const { modal, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage, selectedRequest } = { ...props };

  const [createTripAction, { loading: createTripActionLoading, data: createTripActionData, error: createTripActionError }] = useMutation("/api/workspace/businessTrip");
  const [acceptRequest, { loading: acceptRequestLoading, data: acceptRequestData, error: acceptRequestError }] = useMutation("/api/request/accept");
  const [declineRequest, { loading: declineRequestLoading, data: declineRequestData, error: declineRequestError }] = useMutation("/api/request/decline");

  const { register, control, watch, handleSubmit, getValues, setValue, trigger, formState: { isValid: isFormValid, errors: isFormError }, reset } = useForm({
    defaultValue: {
      projectAlias: selectedRequest.projectAlias ? selectedRequest.projectAlias : null,
      category: null,
    }
  });

  const projectAlias = watch('projectAlias');
  const category = watch('category');

  const { data, mutate, error, isLoading } = useSWR(
    projectAlias ? `/api/project/${projectAlias}` :
      '/api/project');

  useEffect(() => {
    if (isLoading) return;

    if (data?.error) {
      setMessage(
        { type: 'fail', title: `${data.error?.code}`, details: `${data.error?.message}`, }
      )
      setIsNotify(true);
      reset();
    }
  }, [data]);

  useEffect(() => {
    if (isModalOpen)
      setValue('projectAlias', selectedRequest?.projectAlias ?
        selectedRequest?.projectAlias != "INQUIRE" ? selectedRequest?.projectAlias : null : null);
    setValue('category', selectedRequest?.category ?
      selectedRequest?.category != "NS" ? selectedRequest?.category : null : null);
  }, [isModalOpen])

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

  const onValid = (validForm) => {
    
    // console.log(validForm);
    // purchaseRequest(validForm);
  }
  const onInvalid = (errors) => {
    // console.log(errors);
    setMessage(
      {
        type: 'fail', title: 'Request failed.',
        details: `${Object.values(errors)[0]?.message}`,
      }
    )
    setIsNotify(true);
  }

  const onClickAccept = (id) => {
    if (!id) return;
    if (isLoading || createTripActionLoading) return;
    
    trigger();
    if(isFormValid){
      createTripAction({selectedRequest,
        response:"ACCEPT", ...getValues()});
      acceptRequest({ requestId: id, notify: true, ...getValues() })
    }
    else{
      setMessage(
        { type: 'fail', title: 'Incomplete Response.', details: "Incomplete Response. Check the Account / Category.", }
      )
      setIsNotify(true);
    }
  }

  const onClickDecline = (id) => {
    if (!id) return;
    if (isLoading || createTripActionLoading) return;

    // console.log({selectedRequest,response:"DECLINE", ...getValues()})

    declineRequest({ requestId: id, notify: true, ...getValues() })
  }

  useEffect(() => {
    if (createTripActionData?.ok) {
      setMessage(
        { type: 'success', title: 'Successfully Accepted!', details: 'Wait for the page reload.', }
      )
      setIsNotify(true);
      setIsModalOpen(false);
    }

    if (createTripActionData?.error) {
      switch (createTripActionData.error?.code) {
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

  }, [createTripActionData])

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
      open={(modal.kind == isModalOpen.kind && modal.status == isModalOpen.status)}
      onClose={() => setIsModalOpen(false)}
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
                    <dt className="text-sm font-medium text-gray-500">Destination(목적지)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.destination}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Period(기간)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.startDate} ~ {selectedRequest?.endDate}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Details(상세)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.details}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Expenses(예상비용)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.amount}{selectedRequest?.currency}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Due(처리기한)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.date}</dd>
                  </div>

                </dl>
              </div>
            </div>


            {isNotify ? <div className="w-full mt-2">
              <p className="text-xs text-red-600">{message.details}</p>
            </div> : <></>}
            <div className="mt-5 sm:mt-6">
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] text-sm"
                onClick={(e) => {
                  e.preventDefault();
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