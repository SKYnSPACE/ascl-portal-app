import { useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";

import useSWR from "swr";

import { ArrowLongRightIcon } from "@heroicons/react/24/outline";

import useMutation from "../../../libs/frontend/useMutation";
import { useEffect } from "react";

import { classNames } from '../../../libs/frontend/utils'

const Semester = {
  spring: 1,
  summer: 2,
  fall: 3,
  winter: 4,
}

function semesterAliasToString(semester) {
  if (!semester) return null;
  const year = semester.toString().slice(0, 4);
  const season = semester.toString().slice(-2);
  // console.log(year + ' ' + Object.keys(Semester).find(key => Semester[key] === +season))
  return year + ' ' + Object.keys(Semester).find(key => Semester[key] === +season);
}


export default function EditSlotModal({ props }) {
  const { action, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage } = { ...props };

  const { register, control, watch, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      slotId: null,
    },
  });

  const { data: currentSemesterData, error: getCurrentSemesterError, isLoading: getCurrentSemesterLoading } = useSWR('/api/semester/current');
  const { data: currentSlotsData, error: getCurrentSlotsError, isLoading: getCurrentSlotsLoading, mutate } = useSWR('/api/slot/current');

  const [editSlot, { loading, data, error }] = useMutation("/api/settings/slot/edit");

  const slotId = watch('slotId');
  const startsAt = watch('startsAt');
  const endsAt = watch('endsAt');
  

  const onValid = (validForm) => {
    if (loading) return;
    if (endsAt <= startsAt) {
      setMessage(
        { type: 'fail', title: 'Creating seminar slot failed.', details: `Invalid starts/ends time range`, }
      )
      setIsNotify(true);
      console.log("Invalid timestamp");
      return;
    }

    console.log(validForm);
    editSlot(validForm);    
  }
  const onInvalid = (errors) => {

  }

  useEffect(()=>{
    mutate();
  },[loading]);

  useEffect(() => {
    console.log(currentSemesterData)
    if (currentSemesterData) {
      // console.log(semesterAliasToString(currentSemesterData?.semester?.alias));
      setValue('semester', semesterAliasToString(currentSemesterData?.semester?.alias))
    }
  }, [currentSemesterData])

  useEffect(()=>{
    if(currentSlotsData?.slots && slotId){

      const selectedSlot = currentSlotsData.slots.find(slot => slot.id === +slotId);

      setValue('startsAt', selectedSlot.startsAt);
      setValue('endsAt', selectedSlot.endsAt);
      setValue('isBreak', selectedSlot.isBreak);
      setValue('note', selectedSlot.note);

    }
  },[slotId])


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
                Current Semester*
              </label>

              <input
                {...register("semester")}
                type="text"
                name="semester"
                id="semester"
                placeholder='Current semester'
                disabled
                className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 bg-gray-100 rounded-md"
              />

            </div>


            {currentSlotsData?.slots ?
              <>
                <div className="w-full">
                  <label htmlFor="slot" className="text-sm">
                    Slots
                  </label>

                  <select
                    id="slot"
                    name="slot"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    {...register("slotId", {
                      required: "Date is required.",
                    })}
                  >
                    {currentSlotsData?.slots?.map((item) => (<option key={item.id} value={item.id}>[{item.date}] {item.startsAt} ~ {item.endsAt}</option>)
                    )}

                  </select>
                </div>


              </>
              : <></>}

            <div className="w-full">
              <label htmlFor="startsAt" className="text-sm">
                Starts* / Ends*
              </label>
              <div className="flex items-center">
                <input
                  {...register("startsAt", {
                    required: "Start time is required.",
                  })}
                  type="time"
                  name="startsAt"
                  id="startsAt"
                  min="09:00"
                  max="21:00"
                  step="600"
                  required
                  className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"

                />
                <ArrowLongRightIcon className="h-12 w-12 mx-2 text-gray-500" />

                <input
                  {...register("endsAt", {
                    required: "End time is required.",
                  })}
                  type="time"
                  name="endsAt"
                  id="endsAt"
                  min="09:00"
                  max="21:00"
                  step="600"
                  required
                  className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"

                />
              </div>
            </div>


            <div className="w-full mt-2">
              <label className="text-sm">
                Options
              </label>

              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    {...register("isBreak")}
                    id="isBreak"
                    aria-describedby="isBreak-description"
                    name="isBreak"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isBreak" className="font-medium text-gray-700">
                    휴게시간
                  </label>
                  <p id="isBreak-description" className="text-gray-500">
                    식사시간, 커피타임 등 배정시 체크.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full mt-2">
              <label htmlFor="note" className="text-sm">
                Note (optional)
              </label>
              <input
                {...register("note", {
                  maxLength: {
                    message: "The Note must be less than 50 chars.",
                    value: 50,
                  },
                })}
                type="text"
                name="note"
                id="note"
                placeholder="Side note here (e.g. Lunch menu)"
                className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"
              />
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
                  : <span>Modify</span>}
              </button>
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] text-sm"
                onClick={(e) => {
                  reset();
                  setValue('semester', semesterAliasToString(currentSemesterData?.semester?.alias))
                  setIsModalOpen(false);
                }}>
                Close
              </button>
            </div>

          </form>

        </div>
      </div>

    </Dialog>

  );
}