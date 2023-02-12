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

import useMutation from "../../../libs/frontend/useMutation";

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

export default function PurchaseRequestPendingModal({ props }) {
  const { modal, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage, selectedRequest } = { ...props };

  const [createPurchaseAction, { loading: createPurchaseActionLoading, data: createPurchaseActionData, error: createPurchaseActionError }] = useMutation("/api/workspace/purchasing");
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
    if (isLoading || createPurchaseActionLoading) return;
    
    trigger();
    if(isFormValid){
      createPurchaseAction({selectedRequest,
        response:"ACCEPT", ...getValues()});
      acceptRequest({ requestId: id, notify: false, ...getValues() })
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
    if (isLoading || createPurchaseActionLoading) return;

    console.log({selectedRequest,
      response:"DECLINE", ...getValues()})

    declineRequest({ requestId: id, notify: true, ...getValues() })
  }

  useEffect(() => {
    if (createPurchaseActionData?.ok) {
      setMessage(
        { type: 'success', title: 'Successfully Accepted!', details: 'Wait for the page reload.', }
      )
      setIsNotify(true);
      setIsModalOpen(false);
    }

    if (createPurchaseActionData?.error) {
      switch (createPurchaseActionData.error?.code) {
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

  }, [createPurchaseActionData])

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

                </dl>
              </div>
            </div>


            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-full border-1 my-6 bg-white border-gray-600 border-dashed" />
              <span className="absolute px-3 font-medium text-gray-800 -translate-x-1/2 bg-white left-1/2"> R E S P O N S E </span>
            </div>




            <div className="w-full">
              <div className="flex justify-between">
                <label htmlFor="title" className="text-sm font-semibold">
                  Account / Category
                </label>
                {data?.selectedProject ?
                  <div className="text-right text-sm">
                    <p className="text-gray-400">
                      Balance:&nbsp;
                      {category == "MPE" ? `${data.selectedProject.mpeBalance.toLocaleString()}` :
                        category == "CPE" ? `${data.selectedProject.cpeBalance.toLocaleString()}` :
                          category == "ME" ? `${data.selectedProject.meBalance.toLocaleString()}` :
                            category == "AE" ? `${data.selectedProject.aeBalance.toLocaleString()}` : "?"}
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
                  className="block w-full rounded-md border-gray-300 pl-24 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  disabled
                />

                <div className="absolute w-2/3 inset-y-0 left-0 flex items-center">
                  {data?.ok ?
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
                      {data?.managingProjects?.map((item) => (<option key={item.alias} value={item.alias}>{item.title}</option>))}
                      {data?.editableProjects?.map((item) => (<option key={item.alias} value={item.alias}>{item.title}</option>))}

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
                    <option value="ME">회의비</option>
                    <option value="AE">수용비</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full mt-1">
              <label htmlFor="message" className="text-sm font-semibold">
                Message: Notes, cause of decline, etc. (참고사항, 반려사유 등)
              </label>
              <textarea
                {...register("message", {
                  maxLength: {
                    message: "Maximum length of the message is 500.",
                    value: 500
                  }
                })}
                type="text"
                name="message"
                id="message"
                rows={2}
                className="my-1 shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full border-gray-300 rounded-md text-sm"

              />
            </div>




            {isNotify ? <div className="w-full mt-2">
              <p className="text-xs text-red-600">{message.details}</p>
            </div> : <></>}
            <div className="mt-5 sm:mt-6">
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm"
                disabled={createPurchaseActionLoading}
                onClick={(e) => {
                  onClickAccept(selectedRequest.id);
                  // setIsModalOpen(false);
                }}

              >
                {createPurchaseActionLoading ?
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
                  onClickDecline(selectedRequest.id);
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