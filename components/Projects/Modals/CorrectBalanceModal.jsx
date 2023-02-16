import { useState, useEffect } from "react";
import useSWR from "swr";

import { useForm, Controller } from "react-hook-form";

import { Dialog, RadioGroup } from "@headlessui/react";
import { BanknotesIcon, CpuChipIcon, GlobeAltIcon, PencilSquareIcon, Square3Stack3DIcon, TruckIcon, UserGroupIcon } from '@heroicons/react/24/outline';

import { NumericFormat } from 'react-number-format';

import useMutation from "../../../libs/frontend/useMutation";

import { classNames } from '../../../libs/frontend/utils'



const Categories = {
  'MPE': '재료비',
  'CPE': '전산처리비',
  'DTE': '국내출장비',
  'OTE': '해외출장비',
  'ME': '회의비',
  'AE': '수용비',
};


export default function CorrectBalanceModal({ props }) {
  const { alias, selectedCategory, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage } = { ...props };

  const { register, control, watch, handleSubmit, setValue, reset } = useForm({});
  const variance = watch('variance');

  const [correctBalance, { loading: correctBalanceLoading, data: correctBalanceData, error: correctBalanceError }] = useMutation(`/api/project/${alias}/correctBalance`);


  useEffect(() => {
    if (correctBalanceData?.ok) {
      setMessage(
        { type: 'success', title: 'Successfully Corrected!', details: 'Correcting balance completed. Wait for the page reload.', }
      )
      setIsNotify(true);
      reset();
      setIsModalOpen(false);
    }
    if (correctBalanceData?.error) {
      switch (correctBalanceData.error?.code) {
        case '403':
          setMessage(
            { type: 'fail', title: 'Not allowed.', details: `${correctBalanceData.error?.message}`, }
          )
          setIsNotify(true);
          return;
        case 'P1017':
          setMessage(
            { type: 'fail', title: 'Connection Lost.', details: "Database Server does not respond.", }
          )
          setIsNotify(true);
          return;
        case 'P2002':
          setMessage(
            { type: 'fail', title: 'Editing project failed!', details: "You may entered duplicated project information.", }
          )
          setIsNotify(true);
          return;
        default:
          console.log("ERROR", correctBalanceData.error);
      }
    }
  }, [correctBalanceData]);


  const onValid = (validForm) => {
    if (correctBalanceLoading) return;
    if (!variance || variance == 0) {
      setMessage(
        { type: 'fail', title: 'No values to change.', details: `Invalid Correction`, }
      )
      setIsNotify(true);
      return;
    }

    console.log({...validForm, category: selectedCategory});
    correctBalance({...validForm, category: selectedCategory});
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
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="flex items-end justify-center min-h-screen pt-12 px-4 pb-20 text-center sm:block">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-sm sm:w-full sm:p-6">
          <div className={classNames("mx-auto flex items-center justify-center h-12 w-12 rounded-full", 'bg-yellow-100')}>

            <PencilSquareIcon className="h-6 w-6 text-yellow-600" />
            
          </div>

          <div className="mt-1 text-center">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              {Categories[selectedCategory]} 잔고 정정 (관리자용)
            </Dialog.Title>
          </div>
          <Dialog.Description className="mt-4">
            <span className="">계정 잔액 정정을 위한 차감액수와, 정정 사유를 간단히 입력합니다. (잔고 증액의 경우에는 음수를 입력) <br/> </span>
            <span className="text-sm text-red-600">!!주의사항!! 시스템 최초 사용을 위한 잔액 정정, 세금계산 누락, 거래후 취소건 발생 등 ERP상 실제 금액과 잔고를 동기화 하는데에만 사용하십시오. 제안서(계약)상 연구비 총액이나 세목이 변경된 경우에는 Settings에서 프로젝트 수정을 통해 총액을 수정하시기 바랍니다.</span>
          </Dialog.Description>

          <form className="mt-3 flex flex-col items-center" onSubmit={handleSubmit(onValid, onInvalid)}>


            <div className="w-full mt-2">
              <label className="text-sm font-semibold">
                Correction (Put positive numbers to subtract)
              </label>

              <div className="mt-1 -space-y-px rounded-md bg-white shadow-sm">
              <Controller
                      control={control}
                      name="variance"
                      render={({ field: { onChange, name, value } }) => (
                        <NumericFormat
                          className="relative block w-full border rounded-md border-gray-300 bg-transparent focus:z-10 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                          placeholder="Correction"
                          suffix={" KRW"}
                          thousandSeparator=","
                          value={value}
                          // onChange={onChange} 
                          onValueChange={(target) => {
                            onChange();
                            setValue("variance", target.floatValue);
                          }}
                        />
                      )}
                    />
              </div>

              <div className="w-full mt-1">
                <label htmlFor="note" className="text-sm font-semibold">
                  Note (간단한 정정사유)
                </label>
                <input
                  {...register("note", {
                    required: "Note is required.",
                    maxLength: {
                      message: "Maximum length of the note is 80.",
                      value: 80
                    }
                  })}
                  type="text"
                  name="note"
                  id="note"
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
                disabled={correctBalanceLoading}
                type="submit"
              >
                {correctBalanceLoading ?
                  <span className="flex items-center text-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>processing...</span>
                  : <span>Correct</span>}
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