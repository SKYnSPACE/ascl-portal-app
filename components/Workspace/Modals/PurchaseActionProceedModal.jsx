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

import { NumericFormat } from 'react-number-format';
import useMutation from "../../../libs/frontend/useMutation";
import { inRange } from "lodash";

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

export default function PurchaseActionProceedModal({ props }) {
  const { modal, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage, selectedAction } = { ...props };

  const [purchaseAction, { loading: purchaseActionLoading, data: purchaseActionData, error: purchaseActionError }] = useMutation("/api/workspace/purchasing/purchase");
  const [withdrawAction, { loading: withdrawActionLoading, data: withdrawActionData, error: withdrawActionError }] = useMutation("/api/workspace/purchasing/withdraw");
  
  const { register, control, watch, handleSubmit, getValues, setValue, trigger, formState: { isValid: isFormValid, errors: isFormError }, reset } = useForm({
    defaultValue: {
    }
  });

  const totalPrice = watch('totalPrice');

  const [caution, setCaution] = useState(null);

  useEffect(()=>{
    if (!selectedAction) return;
    if (+totalPrice == +selectedAction?.amount?.replaceAll(",",""))
    setCaution(null);
    else{
    setCaution("Caution: Total Price doesn't match with your original request. Please check again.");
  }
  },[totalPrice])

  useEffect(() => {
    if (isModalOpen)
      setValue('projectAlias', selectedAction?.projectAlias ?
        selectedAction?.projectAlias != "INQUIRE" ? selectedAction?.projectAlias : null : null);
    setValue('category', selectedAction?.category ?
      selectedAction?.category != "NS" ? selectedAction?.category : null : null);
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

  const onClickPurchased = () => {
    if (!selectedAction) return;
    if (purchaseActionLoading) return;
    
    trigger();
    if(isFormValid){
      console.log({selectedAction,
      response:"PURCHASED", ...getValues()})

      purchaseAction({selectedAction,
        response:"PURCHASED", ...getValues()});
    }
    else{
      setMessage(
        { type: 'fail', title: 'Incomplete Response.', details: "Incomplete Response. Check the RESPONSE fields are not empty.", }
      )
      setIsNotify(true);
    }
  }

  const onClickWithdraw = (id) => {
    if (!selectedAction) return;
    if (purchaseActionLoading) return;
    withdrawAction({ actionId: +id, response:"WITHDRAW" })
  }

  useEffect(() => {
    if (purchaseActionData?.ok) {
      setMessage(
        { type: 'success', title: 'Accepted!', details: 'Thank you for your decision. Wait for the page reload.', }
      )
      setIsNotify(true);
      setIsModalOpen(false);
    }

    if (purchaseActionData?.error) {
      switch (purchaseActionData.error?.code) {
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

  }, [purchaseActionData])

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
          <div className={classNames("mx-auto flex items-center justify-center h-12 w-12 rounded-full", statusStyles[selectedAction.status])}>
            {selectedAction?.icon ?
              <selectedAction.icon
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
              {modal.name} ({selectedAction.status})
            </Dialog.Title>
          </div>
          <Dialog.Description className="mt-4">
            {/* {modal.detail} */}
          </Dialog.Description>

          <div className="flex flex-col items-center">

            <div className="w-full overflow-hidden bg-white shadow rounded-lg border">
              <div className="px-4 py-3 sm:px-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{selectedAction?.item} (x{selectedAction?.quantity})</h3>
                <p className="mt-1 text-sm text-gray-500">Approved by | {selectedAction?.name}</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-2 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">

                  {/* <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Requested by(신청인)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedAction?.name}</dd>
                  </div> */}
                                    <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Account(처리계정)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedAction?.title}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Category(세목)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{Categories[selectedAction?.category]}</dd>
                  </div>

                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Details(상세)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedAction?.details}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Total Price(총액)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedAction?.amount}{selectedAction?.currency} ({PayMethods[selectedAction?.payMethod]})</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Due(처리기한)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedAction?.date}</dd>
                  </div>

                </dl>
              </div>
            </div>


            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-full border-1 my-6 bg-white border-gray-600 border-dashed" />
              <span className="absolute px-3 font-medium text-gray-800 -translate-x-1/2 bg-white left-1/2"> R E S P O N S E </span>
            </div>

            <div className="w-full">
              <label htmlFor="title" className="text-sm font-semibold">
                Purchased From (Company or Business name, 구매처)
              </label>
              <div className="mt-1 rounded-md shadow-sm">

              <input
                    {...register("purchasedFrom", {
                      required: "Purchased from is required.",
                    })}
                    type="text"
                    name="purchasedFrom"
                    id="purchasedFrom"
                    placeholder="Purchased From"
                    className="w-full inset-y-0 flex items-center rounded-md border-gray-300 focus:border-sky-500 focus:ring-sky-500 text-sm"
                    required
                  />

              </div>
            </div>

            <div className="w-full">
              <label htmlFor="title" className="text-sm font-semibold">
                Total Price (ACTUAL & EXACT amounts you paid, 실 결제 금액)
              </label>
              <div className="mt-1 rounded-md shadow-sm">

                <Controller
                  control={control}
                  name="totalPrice"
                  rules={{ required: true }}
                  render={({ field: { onChange, name, value } }) => (
                    <NumericFormat
                      className="w-full inset-y-0 flex items-center rounded-md border-gray-300 focus:border-sky-500 focus:ring-sky-500 text-sm"
                      placeholder="Total Price"
                      suffix={" KRW"}
                      thousandSeparator=","
                      value={value}
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

            {caution ? <div className="w-full mt-2">
              <p className="text-xs text-yellow-600">{caution}</p>
            </div> : <></>}

            {isNotify ? <div className="w-full mt-2">
              <p className="text-xs text-red-600">{message.details}</p>
            </div> : <></>}
            <div className="mt-5 sm:mt-6">
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm"
                disabled={purchaseActionLoading}
                onClick={(e) => {
                  onClickPurchased();
                  // setIsModalOpen(false);
                }}

              >
                {purchaseActionLoading ?
                  <span className="flex items-center text-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>processing...</span>
                  : <span>Purchased</span>}

              </button>


              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500   sm:text-sm"
                disabled={withdrawActionLoading}
                onClick={(e) => {
                  onClickWithdraw(selectedAction.id);
                  // setIsModalOpen(false);
                }}
              >
                {withdrawActionLoading ?
                  <span className="flex items-center text-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>processing...</span>
                  : <span>Withdraw</span>}

              </button>
            </div>

          </div>



        </div>
      </div>
    </Dialog>

  );
}