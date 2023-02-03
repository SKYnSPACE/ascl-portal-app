// TODO: onClicked Requested list
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Dialog } from "@headlessui/react";

import { useForm } from "react-hook-form";

import { format, parseISO } from "date-fns";

import { CheckIcon, PaperClipIcon } from '@heroicons/react/24/outline';

import useMutation from "../../../libs/frontend/useMutation";
import { RadioGroupStars } from "../../RadioGroupStars";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ReviewAcceptedModal({ props }) {
  const { modal, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage, requestId, seminarData } = { ...props };
  

  const [postReview, { loading: postReviewLoading, data: postReviewData, error: postReviewError }] = useMutation("/api/seminar/review");

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {

      clarity: 1,
      creativity: 1,
      informative: 1,
      integrity: 1,
      verbosity: 1,
    },
  });



  const onValid = (validForm) => {
    if (postReviewLoading) return;
    // console.log({ ...validForm, seminarId: seminarData?.id, requestId })
    postReview({ ...validForm, seminarId: seminarData?.id, requestId });
  }
  const onInvalid = (errors) => {
    if (errors?.year?.message) {
      setMessage(
        { type: 'fail', title: 'Invalid Form.', details: `${errors?.year?.message}`, }
      )
      setIsNotify(true);
    }

  }



  useEffect(() => {
    if (postReviewData?.ok) {
      setMessage(
        { type: 'success', title: 'Successfully Saved!', details: 'Review completed. Wait for the page reload.', }
      )
      setIsNotify(true);
      reset();
      setIsModalOpen(false);
    }

    if (postReviewData?.error) {
      switch (data.error?.code) {
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
          console.log("ERROR CODE", data.error);
      }
    }

  }, [postReviewData])
  

  return (
    <Dialog
      as="div"
      className="fixed z-10 inset-0 overflow-y-auto"
      open={modal.id == isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="flex items-end justify-center min-h-screen pt-12 px-4 pb-20 text-center sm:block">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6">
          <div className={classNames("mx-auto flex items-center justify-center h-12 w-12 rounded-full", modal.iconBackground)}>

            <modal.icon
              className={classNames("h-6 w-6", modal.iconForeground)}
              aria-hidden="true"
            />
          </div>

          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              {modal.name}
            </Dialog.Title>
          </div>
          <Dialog.Description className="mt-4">
            {modal.detail}
          </Dialog.Description>

          <form className="mt-5 flex flex-col items-center" onSubmit={handleSubmit(onValid, onInvalid)}>

            <div className="w-full overflow-hidden bg-white border-[1px] shadow sm:rounded-lg">
              <div className="px-4 py-3 sm:px-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{seminarData?.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{seminarData?.presentedBy?.name}</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-2 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-2 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Last Modified</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{seminarData?.updatedAt ? format(parseISO(seminarData?.updatedAt), "yyyy-MM-dd HH:mm:ss") : ""}</dd>
                  </div>

                  <div className="py-2 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Attachments</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">
                      <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                        <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                          <div className="flex w-0 flex-1 items-center">
                            <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                            <span className="ml-2 w-0 flex-1 truncate">{seminarData?.alias}-draft.{seminarData?.draftFile?.split(".").pop()}</span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <a href={`/uploads/seminar/${seminarData?.draftFile}`}
                              className="font-medium text-sky-600 hover:text-sky-500"
                              download={`${seminarData?.alias}-draft.${seminarData?.draftFile?.split(".").pop()}`}>
                              Download
                            </a>
                          </div>
                        </li>
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>


            <div className="w-full mt-4 border-[1px] shadow overflow-hidden bg-white sm:rounded-lg">
              <div className="px-4 space-y-3 sm:space-y-3 sm:px-0">

                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-2 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="block text-sm font-medium text-gray-500 sm:mt-px sm:pt-2">Review Title</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-3 sm:mt-0">

                      <div className="mt-1 sm:col-span-3 sm:mt-0">
                        <input
                          {...register("title", {
                            required: "Review title field is empty.",
                            maxLength: {
                              message: "Maximum length of the title is 100.",
                              value: 100
                            }
                          })}
                          type="text"
                          name="title"
                          id="title"
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                          required
                        />
                      </div>

                    </dd>
                  </div>

                  <div className="py-2 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Comments</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">

                      <div className="mt-1 sm:col-span-3 sm:mt-0">
                        <textarea
                          {...register("comments", {
                            required: "Review comments field is empty.",
                            maxLength: {
                              message: "Maximum length of the comments is 1000.",
                              value: 1000
                            }
                          })}
                          id="comments"
                          name="comments"
                          rows={4}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                          defaultValue={''}
                          required
                        />
                        <p className="mt-2 text-sm text-gray-500">Write a few review comments about the research.</p>
                      </div>

                    </dd>
                  </div>

                  <div className="py-2 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Ratings</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">

                      <div className="mt-1 sm:col-span-3 sm:mt-0">
                        <div className="grid grid-cols-3 gap-x-6">
                          <div className="group relative">
                            <p className="mx-1 text-sm text-gray-500">Clarity</p>
                            <RadioGroupStars name="clarity" control={control} items={[1, 2, 3, 4, 5]} />
                            <span className="absolute hidden group-hover:flex -left-20 -top-2 -translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                              Does the content of the presentation written clearly so that it can easily convey information to the audience?
                            </span>
                          </div>
                          <div className="group relative">
                            <p className="mx-1 text-sm text-gray-500">Creativity</p>
                            <RadioGroupStars name="creativity" control={control} items={[1, 2, 3, 4, 5]} />
                            <span className="absolute hidden group-hover:flex -left-20 -top-2 -translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                              Does the content of the presentation contain original or creativeideas?
                            </span>
                          </div>
                          <div className="group relative">
                            <p className="mx-1 text-sm text-gray-500">Informative</p>
                            <RadioGroupStars name="informative" control={control} items={[1, 2, 3, 4, 5]} />
                            <span className="absolute hidden group-hover:flex -left-20 -top-2 -translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                              Does the content of the presentation provide helpful/useful information to the audience?
                            </span>

                          </div>
                          <div className="group relative">
                            <p className="mx-1 text-sm text-gray-500">Integrity</p>
                            <RadioGroupStars name="integrity" control={control} items={[1, 2, 3, 4, 5]} />
                            <span className="absolute hidden group-hover:flex -left-20 -top-2 -translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                              Does the contents of the presentation material coherently organized according to the topic?
                            </span>
                          </div>
                          <div className="group relative">
                            <p className="mx-1 text-sm text-gray-500">Verbosity</p>
                            <RadioGroupStars name="verbosity" control={control} items={[1, 2, 3, 4, 5]} />
                            <span className="absolute hidden group-hover:flex -left-20 -top-2 -translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                              Is this presentation material appropriate for a 30-minutes presentation?
                            </span>
                          </div>
                        </div>
                      </div>

                    </dd>
                  </div>

                </dl>
              </div>

            </div>




            <div className="mt-5 sm:mt-6">
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm"
                onClick={(e) => { }}
              >

{postReviewLoading ?
                  <span className="flex items-center text-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>processing...</span>
                  : <span>Submit</span>}

              </button>
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500   sm:text-sm"
                onClick={(e) => {
                  setIsModalOpen(false);
                }}
              >
                Close
              </button>
            </div>

          </form>



        </div>
      </div>
    </Dialog>

  );
}