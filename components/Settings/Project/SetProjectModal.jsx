import { useState, useEffect } from "react";
import useSWR from "swr";

import { useForm, Controller } from "react-hook-form";

import { Dialog, RadioGroup, Switch } from "@headlessui/react";

import { ArrowLongRightIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { NumericFormat } from 'react-number-format';

import useMutation from "../../../libs/frontend/useMutation";

import { classNames } from '../../../libs/frontend/utils'



export default function SetProjectModal({ props }) {
  const { action, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage } = { ...props };

  const { register, control, watch, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      projectAlias: null,
      userId: null,
    },
  });

  const { data, mutate, error, isLoading } = useSWR('/api/settings/project/set');
  const [setProject, { loading: setProjectLoading, data: setProjectData, error: setProjectError }] = useMutation("/api/settings/project/set");

  const projectAlias = watch('projectAlias');
  const userId = watch('userId');

  const isManager = watch('manager');
  const isStaff = watch('staff');
  const isParticipant = watch('participant');

  const [isFinished, setIsFinished] = useState(false)
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);


  const updateModal = ()=>{
    if (data?.currentProjects && projectAlias) {
      const selectedProject = data?.currentProjects.find(project => project.alias === projectAlias);
  
      setSelectedProject(selectedProject);
      setIsFinished(selectedProject?.isFinished);
    
    }
    if (data?.researchers && userId) {
      const selectedProject = data?.currentProjects.find(project => project.alias === projectAlias);
      const selectedUser = data?.researchers.find(researcher => researcher.id === +userId);
      setSelectedUser(selectedUser);
      
      const isManager = !!selectedProject?.managers.find(manager => manager.userId === +userId);
      const isStaff = !!selectedProject?.staffs.find(staff => staff.userId === +userId);
      const isParticipant = !!selectedProject?.participants.find(participant => participant.userId === +userId);
      setValue('manager', isManager);
      setValue('staff', isStaff);
      setValue('participant', isParticipant);
    }
  }

  useEffect(() => {
    if(isLoading || setProjectLoading) return;
    if(data?.ok) updateModal();
  }, [data]);

  useEffect(() => {
    if (setProjectData?.finishedProject) {
      setMessage(
        { type: 'success', title: 'Successfully Closed!', details: 'Project successfully closed. Wait for the page reload.', }
      )
      setIsNotify(true);
      reset();
      setIsModalOpen(false);
    }
    if (setProjectData?.error) {
      switch (setProjectData.error?.code) {
        case '403':
          setMessage(
            { type: 'fail', title: 'Not allowed.', details: `${setProjectData.error?.message}`, }
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
          console.log("ERROR", setProjectData.error);
      }
    }
  }, [setProjectData]);


  useEffect(() => {
    mutate();
  }, [setProjectLoading]);

  useEffect(() => {
    updateModal();
  }, [projectAlias, userId])


  useEffect(() => {
    if (isManager) {
      setValue('staff', false);
      setValue('participant', false);
    }
    else if (isStaff) {
      setValue('manager', false);
      setValue('participant', false);
    }
    else if (isParticipant) {
      setValue('staff', false);
      setValue('manager', false);
    }
  }, [isManager, isStaff, isParticipant])

  const onValid = (validForm) => {
    if (setProjectLoading) return;

    // console.log({ ...validForm, isFinished });
    setProject({ ...validForm, isFinished });
    if(isFinished){
      setValue('projectAlias', null);
      setValue('userId', null);
    } 
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
      open={action.id == isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="flex items-end justify-center min-h-screen pt-12 px-4 pb-20 text-center sm:block">
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
              <label htmlFor="projectAlias" className="text-sm font-semibold">
                Project to Edit
              </label>
              {data?.currentProjects ?
                <select
                  id="projectAlias"
                  name="projectAlias"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 text-sm"
                  {...register("projectAlias", {
                    required: "Project to edit is required.",
                  })}
                >
                  {data?.currentProjects?.map((item) => (<option key={item.alias} value={item.alias}>{item.title}</option>)
                  )}

                </select> : <></>}
            </div>


            {selectedProject?.length != 0 ?<>
              <div className="w-full px-1">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-2 sm:grid sm:grid-cols-4 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Managers</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{selectedProject?.managers?.sort((firstItem, secondItem) => firstItem.user.userNumber - secondItem.user.userNumber).map((manager) => manager.user.name).join(', ')}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-4 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Staffs</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{selectedProject?.staffs?.sort((firstItem, secondItem) => firstItem.user.userNumber - secondItem.user.userNumber).map((staff) => staff.user.name).join(', ')}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-4 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Participants</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{selectedProject?.participants?.sort((firstItem, secondItem) => firstItem.user.userNumber - secondItem.user.userNumber).map((participant) => participant.user.name).join(', ')}</dd>
                  </div>

                  <div className="py-2 sm:grid sm:grid-cols-4 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200">
                    <label htmlFor="isFinished" className="block text-sm font-medium text-red-500 ">
                      <ExclamationTriangleIcon className="w-5 h-5" /> DANGER ZONE
                    </label>
                    <div className="mt-1 sm:col-span-3 sm:mt-0">

                      <Switch.Group as="div" className="flex items-center justify-between">
                        <span className="flex flex-grow flex-col">
                          <Switch.Description as="span" className="text-sm text-gray-500">
                            Check when the project is completed. (<u>This action cannot be undone. Please be certain and press Set to confirm your decision.</u>)      </Switch.Description>
                        </span>
                        <Switch
                          checked={isFinished}
                          onChange={setIsFinished}
                          className={classNames(
                            isFinished ? 'bg-red-600' : 'bg-gray-200',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                          )}
                        >
                          <span
                            className={classNames(
                              isFinished ? 'translate-x-5' : 'translate-x-0',
                              'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                            )}
                          >
                            <span
                              className={classNames(
                                isFinished ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
                                'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                              )}
                              aria-hidden="true"
                            >
                              <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                                <path
                                  d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            <span
                              className={classNames(
                                isFinished ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
                                'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                              )}
                              aria-hidden="true"
                            >
                              <svg className="h-3 w-3 text-red-600" fill="currentColor" viewBox="0 0 12 12">
                                <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                              </svg>
                            </span>
                          </span>
                        </Switch>
                      </Switch.Group>
                    </div>
                  </div>

                </dl>
              </div> 


            <div className="w-full">
              <label htmlFor="userId" className="text-sm font-semibold">
                User to Set
              </label>
              {data?.researchers ?
                <select
                  id="userId"
                  name="userId"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 text-sm"
                  {...register("userId")}
                >
                  {data?.researchers?.map((researcher) => (<option key={researcher.id} value={researcher.id}>{researcher.name}</option>)
                  )}

                </select> : <></>}
            </div>

            {selectedUser?.length != 0 ?
              <div className="w-full mt-2">
                <label htmlFor="assignment" className="text-sm font-semibold">
                  Assign as (Choose only one option or nothing)
                </label>

                <div className="w-full mt-1 grid grid-cols-3 gap-2">

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        {...register("manager")}
                        id="manager"
                        aria-describedby="manager-description"
                        name="manager"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="manager" className="font-medium text-gray-700">
                        Manager
                      </label>
                      <p id="manager-description" className="text-gray-500">
                        실무자(주)
                      </p>
                    </div>

                  </div>
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        {...register("staff")}
                        id="staff"
                        aria-describedby="staff-description"
                        name="staff"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="staff" className="font-medium text-gray-700">
                        Staff
                      </label>
                      <p id="staff-description" className="text-gray-500">
                        참여연구원(실무)
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        {...register("participant")}
                        id="participant"
                        aria-describedby="participant-description"
                        name="participant"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="participant" className="font-medium text-gray-700">
                        Participant
                      </label>
                      <p id="participant-description" className="text-gray-500">
                        참여연구원(계정)
                      </p>
                    </div>
                  </div>

                </div>


              </div> :
              <></>}
</>
              : <></>
            }




            {isNotify ? <div className="w-full mt-2">
              <p className="text-xs text-red-600">{message.details}</p>
            </div> : <></>}
            <div className="mt-5 sm:mt-6">
              <button
                className="group relative mx-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#2980b9] font-medium text-white hover:bg-[#aacae6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] text-sm"
                disabled={setProjectLoading}
                type="submit"
              >
                {setProjectLoading ?
                  <span className="flex items-center text-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>processing...</span>
                  : <span>Set</span>}
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