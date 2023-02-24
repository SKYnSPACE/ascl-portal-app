import { useState, useEffect } from "react";
import useSWR from "swr";
import { Dialog } from "@headlessui/react";

import { useForm } from "react-hook-form";

import { format, parseISO } from "date-fns";

import { ArchiveBoxIcon, PaperClipIcon } from '@heroicons/react/24/outline';

import useMutation from "../../../libs/frontend/useMutation";
import { RadioGroupStars } from "../../RadioGroupStars";
import { StarIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProgressDetailsModal({ props }) {
  const { isModalOpen, setIsModalOpen, selectedSeminar } = { ...props };

  const { data, error, isLoading } = useSWR(
    selectedSeminar ? `/api/seminar/progress/${selectedSeminar}` : null);

  const [averageRating, setAverageRating] = useState({ value: 0.0, message: 'Poor' });

  useEffect(() => {
    if (isLoading) return;
    if (data?.ratings?._avg?.rating1) {
      const averageRating = (0.2 * (data?.ratings?._avg?.rating1 + data?.ratings?._avg?.rating2 + data?.ratings?._avg?.rating3 + data?.ratings?._avg?.rating4 + data?.ratings?._avg?.rating5));
      if (averageRating > 4) {
        setAverageRating({ value: +averageRating, message: 'Excellent' });
      }
      else if (averageRating > 3) {
        setAverageRating({ value: +averageRating, message: 'Good' });
      }
      else if (averageRating > 2) {
        setAverageRating({ value: +averageRating, message: 'Fair' });
      }
      else if (averageRating > 1) {
        setAverageRating({ value: +averageRating, message: 'Poor' });
      }
      else {
        setAverageRating({ value: +averageRating, message: 'Bad' });
      }
    }
  }, [data]);

  return (
    <Dialog
      as="div"
      className="fixed z-10 inset-0 overflow-y-auto"
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6">
          <div className={classNames("mx-auto flex items-center justify-center h-12 w-12 rounded-full", "bg-sky-50")}>

            <ArchiveBoxIcon
              className={classNames("h-6 w-6", 'text-sky-700')}
              aria-hidden="true"
            />
          </div>

          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              Seminar Details
            </Dialog.Title>
          </div>
          <Dialog.Description className="mt-4">
            {/* {DETAIL} */}
          </Dialog.Description>

          <div className="mt-5 flex flex-col items-center">

            <div className="w-full overflow-hidden bg-white border-[1px] shadow sm:rounded-lg">
              <div className="py-3 px-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{data?.currentSeminar?.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{data?.currentSeminar?.presentedBy?.name}</p>
              </div>
              <div className="border-t border-gray-200 py-2 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Last Modified</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{data?.currentSeminar?.updatedAt ? format(parseISO(data?.currentSeminar?.updatedAt), "yyyy-MM-dd HH:mm:ss") : ""}</dd>
                  </div>
                  <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Category (Tags)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-3 sm:mt-0">{data?.currentSeminar?.category} {` `}
                      <span className="text-gray-500">({data?.currentSeminar?.tags})</span>
                    </dd>
                  </div>
                  <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-4 sm:py-3">
                    <dt className="text-sm font-medium text-gray-500">Abstract</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-3 sm:mt-0">
                      {data?.currentSeminar?.abstract}
                    </dd>
                  </div>

                  {data?.currentSeminar?.draftFile ?
                    <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-4 sm:py-3">
                      <dt className="text-sm font-medium text-gray-500">Attachments</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">
                        <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                          <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                            <div className="flex w-0 flex-1 items-center">
                              <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                              <span className="ml-2 w-0 flex-1 truncate">{data?.currentSeminar?.alias}-draft.{data?.currentSeminar?.draftFile?.split(".").pop()}</span>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <a href={`/uploads/seminar/${data?.currentSeminar?.draftFile}`}
                                className="font-medium text-sky-600 hover:text-sky-500"
                                download={`${data?.currentSeminar?.alias}-draft.${data?.currentSeminar?.draftFile?.split(".").pop()}`}>
                                Download
                              </a>
                            </div>
                          </li>
                          {data?.currentSeminar?.finalFile ?
                            <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                              <div className="flex w-0 flex-1 items-center">
                                <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                <span className="ml-2 w-0 flex-1 truncate">{data?.currentSeminar?.alias}-final.{data?.currentSeminar?.finalFile?.split(".").pop()}</span>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <a href={`/uploads/seminar/${data?.currentSeminar?.finalFile}`}
                                  className="font-medium text-sky-600 hover:text-sky-500"
                                  download={`${data?.currentSeminar?.alias}-final.${data?.currentSeminar?.finalFile?.split(".").pop()}`}>
                                  Download
                                </a>
                              </div>
                            </li> : <li></li>}
                        </ul>
                      </dd>
                    </div> : <></>}


                  {data?.ratings?._count?.rating1 ?
                    <div className="px-4 py-2 sm:grid sm:grid-cols-4 sm:gap-2 sm:px-4 sm:py-3">
                      <dt className="text-sm font-medium text-gray-500">Reviews</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-3 sm:mt-0">

                        <div className="flex items-center mb-2">
                          <p className="bg-sky-100 text-sky-800 text-sm font-semibold inline-flex items-center p-1.5 rounded  ">{averageRating.value.toFixed(1)}</p>
                          <p className="ml-2 font-medium text-gray-900 "> {averageRating.message} </p>
                          <span className="w-1 h-1 mx-2 bg-gray-900 rounded-full "></span>
                          <p className="text-sm font-medium text-gray-500 "> {data?.ratings?._count?.rating1} reviews</p>
                        </div>
                        <div className="gap-x-3 gap-y-1 grid grid-cols-3">

                          <dl>
                            <dt className="group relative text-sm font-medium text-gray-500">
                              Clarity
                              <span className="absolute hidden group-hover:flex -left-5 sm:-left-20 -top-2 -translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                                Does the content of the presentation written clearly so that it can easily convey information to the audience?
                              </span>
                            </dt>
                            <dd className="flex items-center">
                              <div className="w-full bg-gray-200 rounded h-2.5  mr-2">
                                <div className="bg-sky-600 h-2.5 rounded " style={{ width: `${20 * data?.ratings?._avg?.rating1}%`, }}></div>
                              </div>
                              <span className="text-sm font-medium text-gray-500 ">{data?.ratings?._avg?.rating1?.toFixed(1)}</span>
                            </dd>
                          </dl>
                          <dl>
                            <dt className="group relative text-sm font-medium text-gray-500">
                              Creativity
                              <span className="absolute hidden group-hover:flex -left-20 -top-2 -translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                              Does the content of the presentation contain original or creative ideas?
                              </span>
                            </dt>
                            <dd className="flex items-center ">
                              <div className="w-full bg-gray-200 rounded h-2.5  mr-2">
                                <div className="bg-sky-600 h-2.5 rounded " style={{ width: `${20 * data?.ratings?._avg?.rating2}%`, }}></div>
                              </div>
                              <span className="text-sm font-medium text-gray-500 ">{data?.ratings?._avg?.rating2?.toFixed(1)}</span>
                            </dd>
                          </dl>
                          <dl>
                            <dt className="group relative text-sm font-medium text-gray-500">
                              Informative
                              <span className="absolute hidden group-hover:flex -left-20 -top-2 -translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                              Does the content of the presentation provide helpful/useful information to the audience?
                              </span>
                            </dt>
                            <dd className="flex items-center ">
                              <div className="w-full bg-gray-200 rounded h-2.5  mr-2">
                                <div className="bg-sky-600 h-2.5 rounded " style={{ width: `${20 * data?.ratings?._avg?.rating3}%`, }}></div>
                              </div>
                              <span className="text-sm font-medium text-gray-500 ">{data?.ratings?._avg?.rating3?.toFixed(1)}</span>
                            </dd>
                          </dl>
                          <dl>
                            <dt className="group relative text-sm font-medium text-gray-500">
                              Integrity
                              <span className="absolute hidden group-hover:flex -left-5 sm:-left-20 -top-2 -translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                              Does the contents of the presentation material coherently organized according to the topic?
                              </span>
                            </dt>
                            <dd className="flex items-center">
                              <div className="w-full bg-gray-200 rounded h-2.5  mr-2">
                                <div className="bg-sky-600 h-2.5 rounded " style={{ width: `${20 * data?.ratings?._avg?.rating4}%`, }}></div>
                              </div>
                              <span className="text-sm font-medium text-gray-500 ">{data?.ratings?._avg?.rating4?.toFixed(1)}</span>
                            </dd>
                          </dl>
                          <dl>
                            <dt className="group relative text-sm font-medium text-gray-500">
                              Verbosity
                              <span className="absolute hidden group-hover:flex -left-20 -top-2 -translate-y-full w-48 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                              Is this presentation material appropriate for a 30-minutes presentation?
                              </span>
                            </dt>
                            <dd className="flex items-center ">
                              <div className="w-full bg-gray-200 rounded h-2.5  mr-2">
                                <div className="bg-sky-600 h-2.5 rounded " style={{ width: `${20 * data?.ratings?._avg?.rating5}%`, }}></div>
                              </div>
                              <span className="text-sm font-medium text-gray-500 ">{data?.ratings?._avg?.rating5?.toFixed(1)}</span>
                            </dd>
                          </dl>

                        </div>

                      </dd>
                    </div> : <></>}



                </dl>
              </div>
            </div>



            <div className="mt-5 sm:mt-6">
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] text-sm"
                onClick={(e) => {
                  // reset();
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