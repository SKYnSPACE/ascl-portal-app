import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

import useSWR from "swr";

import { useForm } from "react-hook-form";

import ComboBoxControlled from "../../ComboBoxControlled";

import useMutation from "../../../libs/frontend/useMutation";

import { classNames } from '../../../libs/frontend/utils'

const Semester = {
  spring: 1,
  summer: 2,
  fall: 3,
  winter: 4,
}

function semesterStringToAlias(semester) {
  if (semester) {
    const year = semester.split(' ')[0];
    const season = semester.split(' ')[1];
    return +(year.toString() + '0' + Semester[season]);
  }
}

function semesterAliasToString(semester){
  if(!semester) return null;
  const year = semester.toString().slice(0,4);
  const season = semester.toString().slice(-2);
  // console.log(year + ' ' + Object.keys(Semester).find(key => Semester[key] === +season))
  return year + ' ' + Object.keys(Semester).find(key => Semester[key] === +season);
}


export default function SetSemesterModal({ props }) {
  // const [semesterToEdit, setSemesterToEdit] = useState(null);

  const { action, semestersList, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage } = { ...props };
  const { register, control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      semester: null,
    }
  });

  const { data: currentSemesterData, error: getCurrentSemesterError, isLoading: getCurrentSemesterLoading } = useSWR('/api/semester/current');

  const [setSemester, { loading, data, error }] = useMutation("/api/settings/semester/set");
  
  
  const onValid = (validForm) => {
    if (loading) return;
    // console.log({...validForm, prevSemester:semesterAliasToString(currentSemesterData?.semester?.alias)});
    setSemester({...validForm, prevSemester:semesterAliasToString(currentSemesterData?.semester?.alias)});
    // console.log({ ...validForm, id: semesterToEdit.id })
    // editUser({ ...validForm, id: semesterToEdit.id });
  }

  useEffect(()=>{
    if(currentSemesterData){
      // console.log(semesterAliasToString(currentSemesterData?.semester?.alias));
      setValue('semester', semesterAliasToString(currentSemesterData?.semester?.alias))
    }
  },[currentSemesterData])


  useEffect(() => {
    if (data?.ok) {
      setMessage(
        { type: 'success', title: 'Successfully Saved!', details: 'Editing user completed. Wait for the page reload.', }
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
          return;
        case 'P2002':
          console.log("Data is not unique.");
          setMessage(
            { type: 'fail', title: 'Editing user failed!', details: "You may entered someone else's Email or phone number.", }
          )
          setIsNotify(true);
          return;
        default:
          console.log("ERROR", data.error);
      }
    }
  }, [data])
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


          <form className="mt-3 flex flex-col items-center" onSubmit={handleSubmit(onValid)}>


            {semestersList ?
              <>
                <div className="w-full">
                  <label htmlFor="semester" className="text-sm">
                    Current Semester
                  </label>
                  <ComboBoxControlled name="semester" control={control} items={semestersList} />
                </div>

              </>
              : <></>}



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
                  setValue('semester', semesterAliasToString(currentSemesterData?.semester?.alias))
                  setIsModalOpen(false);
                }}>
                Cancel
              </button>
            </div>

          </form>


        </div>
      </div>

    </Dialog>

  );
}