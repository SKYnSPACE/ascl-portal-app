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


export default function CreateSlotModal({ props }) {
  const { action, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage } = { ...props };

  const { register, control, watch, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
    },
  });

  const { data: currentSemesterData, error: getCurrentSemesterError, isLoading: getCurrentSemesterLoading } = useSWR('/api/semester/current');

  const [createSlot, { loading, data, error }] = useMutation("/api/settings/slot/create");

  const startDate = watch('startDate');
  const endDate = watch('endDate');


  const onValid = (validForm) => {
    if (loading) return;
    if (endDate <= startDate) {
      setMessage(
        { type: 'fail', title: 'Creating project failed.', details: `Invalid starts/ends date range`, }
      )
      setIsNotify(true);
      return;
    }

    setValue('startDate', "");
    setValue('endDate', "");
    setValue('isBreak', false);
    setValue('note', "");

    console.log(validForm);
    // createSlot(validForm);
  }
  const onInvalid = (errors) => {

  }

  useEffect(() => {
    console.log(currentSemesterData)
    if (currentSemesterData) {
      // console.log(semesterAliasToString(currentSemesterData?.semester?.alias));
      setValue('semester', semesterAliasToString(currentSemesterData?.semester?.alias))
    }
  }, [currentSemesterData])


  // useEffect(() => {
  //   if (data?.ok) {
  //     setMessage(
  //       { type: 'success', title: 'Successfully Saved!', details: 'New semester created. Wait for the page reload.', }
  //     )
  //     setIsNotify(true);
  //     reset();
  //     setIsModalOpen(false);
  //   }

  //   if (data?.error) {
  //     switch (data.error?.code) {
  //       case 'P1017':
  //         console.log("Connection Lost.")
  //         setMessage(
  //           { type: 'fail', title: 'Connection Lost.', details: "Database Server does not respond.", }
  //         )
  //         setIsNotify(true);
  //       case 'P2002':
  //         console.log("Existing User.");
  //         setMessage(
  //           { type: 'fail', title: 'Creating semester failed!', details: "Semester already exists.", }
  //         )
  //         setIsNotify(true);
  //       default:
  //         console.log("ERROR CODE", data.error);
  //     }
  //   }

  // }, [data])


  return (
    <Dialog
      as="div"
      className="fixed z-10 inset-0 overflow-y-auto"
      open={action.id == isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="flex items-end justify-center min-h-screen pt-32 px-4 pb-20 text-center sm:block">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
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
              <label htmlFor="title" className="text-sm">
                Title
              </label>
              <input
                {...register("title", {
                  required: "Title is required.",
                })}
                type="text"
                name="title"
                id="title"
                required
                className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"

              />
            </div>

            <div className="w-full">
              <label htmlFor="title" className="text-sm">
                Alias
              </label>
              <div className="flex items-center">
                계정번호, 정산여부
              </div>
            </div>

            <div className="w-full">
              <label htmlFor="startDate" className="text-sm">
                Starts* / Ends*
              </label>
              <div className="flex items-center">
                <input
                  {...register("startDate", {
                    required: "Start date is required.",
                  })}
                  type="date"
                  name="startDate"
                  id="startDate"
                  required
                  className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"

                />
                <ArrowLongRightIcon className="h-12 w-12 mx-2 text-gray-500" />

                <input
                  {...register("endDate", {
                    required: "End date is required.",
                  })}
                  type="date"
                  name="endDate"
                  id="endDate"
                  required
                  className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"

                />
              </div>
            </div>

            <div className="w-full">
              <label htmlFor="title" className="text-sm">
                Team / Scale
              </label>
              <div className="flex items-center">
                담당부서 / 프로젝트 규모
              </div>
            </div>


            <div className="w-full mt-2">
              <label className="text-sm">
                Costs [KRW]
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
                <div className="flex items-center">
                재료비 / 국내출장비 / 해외출장비
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
                  : <span>Create</span>}
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

      {/* <CustomModal props={{ popup: popups[0], isResultModalOpen, setIsResultModalOpen }} /> */}

    </Dialog>

  );
}