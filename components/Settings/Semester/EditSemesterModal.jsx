import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

import useSWR from "swr";

import { useForm } from "react-hook-form";

import PhoneInput from "react-phone-number-input/react-hook-form-input"

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


export default function EditSemesterModal({ props }) {
  // const [semesterToEdit, setSemesterToEdit] = useState(null);

  const { action, semestersList, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage } = { ...props };
  const { register, control, watch, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      semester: null,
    }
  });

  const semesterToEdit = watch('semester');
  const [semesterToEditAlias, setSemesterToEditAlias] = useState(null);
  const { data: semesterData, error: getSemesterError, isLoading: getSemesterLoading } = useSWR(
    semesterToEditAlias === null ? null : `/api/semester/${semesterToEditAlias}`
  );

  const [editSemester, { loading, data, error }] = useMutation("/api/settings/semester/edit");

  const onValid = (validForm) => {
    if (loading) return;
    console.log(validForm);
    editSemester(validForm);
    // console.log({ ...validForm, id: semesterToEdit.id })
    // editUser({ ...validForm, id: semesterToEdit.id });
  }


  useEffect(() => {
    if (semesterToEdit) {
      const semesterToEditAlias = semesterStringToAlias(semesterToEdit);

      setSemesterToEditAlias(semesterToEditAlias);
    }
  }, [semesterToEdit]);

  useEffect(() => {
    if (semesterData) {
      setValue("doctors", semesterData?.semester?.postDocCount);
      setValue("doctorCandidates", semesterData?.semester?.phdCandidateCount);
      setValue("masterCandidates", semesterData?.semester?.msCandidateCount);
    }
  }, [semesterData])

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
        case 'P2002':
          console.log("Data is not unique.");
          setMessage(
            { type: 'fail', title: 'Editing user failed!', details: "You may entered someone else's Email or phone number.", }
          )
          setIsNotify(true);
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

          <div className="mt-3 text-center sm:mt-5">
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


          <form className="mt-5 flex flex-col items-center" onSubmit={handleSubmit(onValid)}>


            {semestersList ?
              <>
                <div className="w-full">
                  <label htmlFor="semester" className="text-sm">
                    Semester
                  </label>
                  <ComboBoxControlled name="semester" control={control} items={semestersList} />
                </div>

                {getSemesterLoading ? <svg className="animate-spin -ml-1 mr-2 mt-5 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg> :
                  <div className="w-full">
                    <label htmlFor="doctors" className="text-sm">
                      Personnel (포닥/ 박사과정/ 석사과정)
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      <input
                        {...register("doctors", {
                          valueAsNumber: true,
                          required: "Post doctors field empty.",
                        })}
                        type="number"
                        name="doctors"
                        id="doctors"
                        placeholder='Post'
                        required
                        className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"
                      />
                      <input
                        {...register("doctorCandidates", {
                          valueAsNumber: true,
                          required: "Doctor candidates field empty.",
                        })}
                        type="number"
                        name="doctorCandidates"
                        id="doctorCandidates"
                        placeholder='PhD Candidates'
                        required
                        className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"
                      />
                      <input
                        {...register("masterCandidates", {
                          valueAsNumber: true,
                          required: "Master candidates field empty.",
                        })}
                        type="number"
                        name="masterCandidates"
                        id="masterCandidates"
                        placeholder='Master Candidates'
                        required
                        className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"
                      />

                    </div>

                  </div>}

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