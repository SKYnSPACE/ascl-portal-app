import { useEffect, useState } from 'react';
import axios from "axios";
import useSWR from "swr";
import { useForm } from 'react-hook-form';

// import { MuiChipsInput } from 'mui-chips-input';

import { PaperClipIcon, StarIcon } from '@heroicons/react/20/solid';

import useMutation from "../../libs/frontend/useMutation";

import ProgressBarSimple from '../ProgressBarSimple';
import Notification from '../Notification';
import LoadingSpinner from '../LoadingSpinner';


const reviewers = [
  {
    id: 0,
    name: 'Hyochoong Bang',
    researchField: 'All',
    handlingRequests: 1,
    response: 'accepted',
  },
  {
    id: 1,
    name: 'Seongheon Lee',
    researchField: 'AI',
    handlingRequests: 4,
    response: 'pending',
  },
  {
    id: 2,
    name: 'Junwoo Park',
    researchField: 'Navigation',
    handlingRequests: 4,
    response: 'accepted',
  },
  {
    id: 3,
    name: 'Kyungwoo Hong',
    researchField: 'Navigation',
    handlingRequests: 2,
    response: 'rejected',
  },
  {
    id: 4,
    name: 'Dongwoo Lee',
    researchField: 'Control',
    handlingRequests: 1,
    response: 'null',
  },
  {
    id: 5,
    name: 'Chulsoo Lim',
    researchField: 'Guidance',
    handlingRequests: 4,
    response: 'null',
  },
  // More reviewers...
]

const reviews = [
  {
    id: 1,
    title: "Thank you so much!",
    rating: 5,
    content: `
      <p>I was really pleased with the overall presentation material, which delighted me!</p>
      <p>Thank you so much!</p>
    `,
    author: 'Hyochoong Bang',
    date: 'May 16, 2021',
    datetime: '2021-01-06',
  },
  {
    id: 2,
    title: "Why do we use it?",
    rating: 4,
    content: `
    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
    `,
    author: 'Junwoo Park',
    date: 'May 16, 2021',
    datetime: '2021-01-06',
  },
  // More reviews...
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
  })
}
export default function Submission() {
  const { data: seminarData, error, isLoading } = useSWR(`/api/seminar`);

  const { register, setValue, watch, handleSubmit } = useForm();
  const [saveSubmission, { loading, data: submissionData, error: submissionError }] = useMutation("/api/seminar/save");
  // const [download, { loading:downloadLoading, data: downloadData, error: downloadError }] = useMutation("/api/seminar/download");

  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);


  const { data: reviewData, error: reviewError, isLoading: reviewIsLoading } = useSWR(`/api/seminar/review`);
  const [reviewers, setReviewers] = useState([]);
  const [reviewRequest, { loading: reviewRequestLoading, data: reviewRequestData, error: reviewRequestError }] = useMutation("/api/request/review");



  const [isNotify, setIsNotify] = useState(false);
  const [message, setMessage] = useState({ type: 'success', title: 'Confirmed!', details: 'Test message initiated.', });

  const onValid = (validForm) => {
    console.log({ ...validForm, alias: seminarData?.mySeminarSubmission?.alias, file: uploadedFile });
    saveSubmission({ ...validForm, alias: seminarData?.mySeminarSubmission?.alias, file: uploadedFile });
  }
  const onInvalid = (errors) => {
    console.log(errors);
  }


  const onSelectedFile = async (e) => {
    const fileInput = e.target;
    if (!fileInput.files || fileInput.files.length === 0) return;

    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) return;

    //TODO: REMOVE file from the server when uploadedFile is not null 
    if (uploadedFile) {
      const deleteResponse = await fetch(`/api/seminar/delete?token=${uploadedFile.name}&ext=${uploadedFile.ext}`, {
        method: 'DELETE'
      })
      console.log(deleteResponse)
    }
    else if (seminarData?.mySeminarSubmission?.draftFile) {
      const prevFile = seminarData?.mySeminarSubmission?.draftFile;
      const indexOfLastDot = prevFile.lastIndexOf('.');
      const fileName = prevFile.slice(0, indexOfLastDot); //name only (w/o extension)
      const extension = prevFile.slice(indexOfLastDot + 1);

      const deleteResponse = await fetch(`/api/seminar/delete?token=${fileName}&ext=${extension}`, {
        method: 'DELETE'
      })
      console.log(deleteResponse)
    }

    try {
      let startAt = Date.now();
      let formData = new FormData();
      formData.append("media", file);

      const options = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;

          // Calculate the progress percentage
          const percentage = (loaded * 100) / total;
          setProgress(+percentage.toFixed(2));

          // Calculate the progress duration
          const timeElapsed = Date.now() - startAt;
          const uploadSpeed = loaded / timeElapsed;
          const duration = (total - loaded) / uploadSpeed;
          setRemaining(duration);
        },
      };

      const {
        data: { data },
      } = await axios.post("/api/seminar/upload", formData, options);

      console.log("File was uploaded successfylly:", data);
      setUploadedFile({ name: data?.fileName, ext: data?.extension });
    } catch (e) {
      console.error(e);
      const error =
        e.response && e.response.data
          ? e.response.data.error
          : "Sorry! something went wrong.";
      alert(error);
    }
  };

  const askForReview = async (id) => {
    console.log(id)
    reviewRequest({ requestFor: id, alias: seminarData?.mySeminarSubmission?.alias })
  }

  //TODO: send the filename to API right away!!
  // otherwise, orphan file will remain in the server...      
  useEffect((
  ) => {
    if (uploadedFile) {
      saveSubmission({ alias: seminarData?.mySeminarSubmission?.alias, file: uploadedFile })
    }
  }, [uploadedFile])

  useEffect(() => {
    if (seminarData?.mySeminarSubmission) {
      setValue("title", seminarData.mySeminarSubmission.title);
      setValue("abstract", seminarData.mySeminarSubmission.abstract);
      setValue("category", seminarData.mySeminarSubmission.category);
      setValue("tags", seminarData.mySeminarSubmission.tags);
    }
  }, [seminarData]);

  useEffect(() => {
    if (reviewData?.reviewers) {
      console.log(reviewData.reviewers)
      setReviewers(reviewData.reviewers);
    }
  }, [reviewData])

  useEffect(() => {
    if (reviewRequestData?.ok) {
      setMessage(
        { type: 'success', title: 'Ask review complete!', details: 'Created review request successfully. Wait for the page reload.', }
      )
      setIsNotify(true);
    }

    if (reviewRequestData?.error) {
      switch (reviewRequestData.error?.code) {
        case 'P1017':
          console.log("Connection Lost.")
          setMessage(
            { type: 'fail', title: 'Connection Lost.', details: "Database Server does not respond.", }
          )
          setIsNotify(true);
        case 'P2002':
          console.log("Existing Request.");
          setMessage(
            { type: 'fail', title: 'Creating request failed!', details: "Request already exists.", }
          )
          setIsNotify(true);
        default:
          console.log("ERROR CODE", data.error);
      }
    }

  }, [reviewRequestData])

  return (
    <>
      <form onSubmit={handleSubmit(onValid, onInvalid)} className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">


          {/* {DRAFT} */}
          {seminarData?.mySeminarSubmission ?
            <div className="space-y-6 sm:space-y-5">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Draft</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>

              <div className="space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Title
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <div className="flex max-w-lg rounded-md shadow-sm">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                        {seminarData?.mySeminarSubmission?.alias}
                      </span>
                      <input
                        {...register("title", {
                          // required: "Title is required.",
                          maxLength: {
                            message: "Maximum length of the title is 100.",
                            value: 100
                          }
                        })
                        }
                        id="title"
                        name="title"
                        type="text"
                        // required
                        className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Abstract <span>({watch("abstract")?.length}/500)</span>

                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <textarea
                      {...register("abstract", {
                        // required: "Abstract is required.",
                        maxLength: {
                          message: "Maximum length of the abstract is 500.",
                          value: 500
                        }
                      })
                      }
                      id="abstract"
                      name="abstract"
                      rows={7}
                      // required
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      defaultValue={''}
                    />
                    <p className="mt-2 text-sm text-gray-500">Write a few sentences about the presentation.</p>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Category
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <select
                      {...register("category")}
                      id="category"
                      name="category"
                      autoComplete="category-name"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                    >
                      <option value="none">None</option>
                      <option value="aircraft">Aircraft</option>
                      <option value="satellite">Satellite</option>

                    </select>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Tags
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <input
                      {...register("tags", {
                        // required: "Title is required.",
                        maxLength: {
                          message: "Maximum length of the tags is 70.",
                          value: 70
                        }
                      })}
                      id="tags"
                      name="tags"
                      type="text"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                    <p className="mt-2 text-sm text-gray-500">ONLY USE lowercase UNLESS IT IS AN ACRONYM. Use comma(,) to separate tags.</p>

                    {/* <MuiChipsInput size="small" value={tags} onChange={handleTagsChange} helperText={tags.length > 0 ? "Double click to edit a tag":""}/> */}
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <label htmlFor="draft" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Presentation Material
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">


                    {seminarData?.mySeminarSubmission?.draftFile ?
                      <div className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                        <div className="flex w-0 flex-1 items-center text-gray-500">
                          <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                          <span className="ml-1 w-0 flex-1 truncate">{`${seminarData?.mySeminarSubmission?.alias}-draft.${seminarData?.mySeminarSubmission?.draftFile?.split(".").pop()}`}</span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <a href={`/uploads/seminar/${seminarData?.mySeminarSubmission?.draftFile}`}
                            className="font-medium text-sky-600 hover:text-sky-500"
                            download={`${seminarData?.mySeminarSubmission?.alias}-draft.${seminarData?.mySeminarSubmission?.draftFile?.split(".").pop()}`}>
                            Download
                          </a>
                        </div>
                      </div>
                      : <></>}


                    <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                      <div className="space-y-1 text-center">

                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="draft"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:text-sky-500"
                          >
                            <span>Upload a new file</span>
                            <input
                              id="draft"
                              name="draft"
                              type="file" className="sr-only"
                              onChange={onSelectedFile}
                            />
                          </label>
                          {/* <p className="pl-1">or drag and drop</p> */}
                          <p className="pl-1">(single file up to 200MB)</p>
                        </div>
                        {/* <p className="text-xs text-gray-500">up to 200MB</p> */}

                        <ProgressBarSimple progress={progress} remaining={remaining} />


                        {progress != 100 ?
                          // <svg
                          //   className="mx-auto h-12 w-12 text-gray-400"
                          //   stroke="currentColor"
                          //   fill="none"
                          //   viewBox="0 0 48 48"
                          //   aria-hidden="true"
                          // >
                          //   <path
                          //     d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          //     strokeWidth={2}
                          //     strokeLinecap="round"
                          //     strokeLinejoin="round"
                          //   />
                          // </svg>
                          <div className="text-sm text-center text-gray-600">
                            <p>
                              <span>Only supports single file upload.<br />Compress your materials if needed. </span>
                            </p>
                          </div>
                          : <div className="text-sm text-center text-gray-600">
                            {uploadedFile ?
                              <p>
                                <span>Your token: </span>
                                <a className="relative cursor-pointer rounded-md bg-white font-medium text-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:text-sky-500"
                                  href={`/uploads/seminar/${uploadedFile.name}.${uploadedFile.ext}`}
                                  download={`${seminarData?.mySeminarSubmission?.alias}-draft.${uploadedFile.ext}`}>{uploadedFile.name}</a> </p>
                              : <></>}
                            <span>Press save to complete <br />the draft submission.</span>
                          </div>
                        }

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            : <></>}

          {/* TODO: capacity 없애기. */}
          {/* TODO: user 목록[userList] 수집 (id, name, position) -> guest는 필터링  */}
          {/* TODO: 나의 request 목록 수집, [userList]를 [reviewerList]로 upsert  */}
          {/* TODO: review 중 내가 mention된 review 정보 수집. [reviews] */}
          {/* REVIEW */}
          {seminarData?.mySeminarSubmission?.progress >= 1 ?
            <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Reviews</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Ask for a review and check the responses. Press select button to send a review request.
                  <br /> You need at least one review to proceed.</p>
              </div>

              <div className="space-y-6 sm:space-y-5">

                <div className="sm:grid sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <div className="-mx-4 ring-1 ring-gray-300 sm:-mx-6 md:mx-0 md:rounded-lg">

                    {reviewRequestLoading || isNotify ?
                      <div className="flex items-center justify-center my-8">
                        <LoadingSpinner className="h-8 w-8 text-sky-500" />
                      </div>
                      :

                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                              Name
                            </th>
                            <th
                              scope="col"
                              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                            >
                              Research Fields
                            </th>
                            {/* <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                          Capacity
                        </th> */}
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-gray-900">
                              {/* 1 &lt;- 1 -&gt; 1 */}
                              <span className="sr-only">Select</span>
                            </th>
                          </tr>
                        </thead>


                        <tbody>
                          {reviewers?.map((reviewer, index) => (
                            <tr key={reviewer.id}>
                              <td
                                className={classNames(
                                  index === 0 ? '' : 'border-t border-transparent',
                                  'relative py-1 pl-4 sm:pl-6 pr-3 text-sm'
                                )}
                              >
                                <div className="font-medium text-gray-900">
                                  {reviewer.name}
                                  {reviewer.requests[0]?.status == 0 ? <span className="ml-1 text-yellow-600">(Pending)</span> : null}
                                  {reviewer.requests[0]?.status == 1 ? <span className="ml-1 text-sky-600">(Current reviewer)</span> : null}
                                  {reviewer.requests[0]?.status == -1 ? <span className="ml-1 text-red-600">(Rejected)</span> : null}

                                </div>
                                <div className="mt-1 flex flex-col text-gray-500 sm:block lg:hidden">
                                  <span>
                                    / {reviewer.researchField}
                                  </span>
                                  <span className="hidden sm:inline">·</span>
                                  <span>{reviewer.storage}</span>
                                </div>
                                {index !== 0 ? <div className="absolute right-0 left-6 -top-px h-px bg-gray-200" /> : null}
                              </td>
                              <td
                                className={classNames(
                                  index === 0 ? '' : 'border-t border-gray-200',
                                  'hidden px-3 py-1 text-sm text-gray-500 lg:table-cell'
                                )}
                              >
                                {reviewer.researchField}
                              </td>

                              {/* <td
                            className={classNames(
                              index === 0 ? '' : 'border-t border-gray-200',
                              'px-3 py-1 text-sm text-gray-500 text-center'
                            )}
                          >
                            <div className="sm:hidden">{reviewer.handlingRequests}/{reviewer.id == 0 ? <span>&infin;</span> : 4}</div>
                            <div className="hidden sm:block">{reviewer.handlingRequests}/{reviewer.id == 0 ? <span>&infin;</span> : 4} Seats {reviewer.handlingRequests >= 4 ? <span className="ml-1 text-gray-600">(Full)</span> : null}
                            </div>
                          </td> */}
                              <td
                                className={classNames(
                                  index === 0 ? '' : 'border-t border-transparent',
                                  'relative py-1 pl-3 pr-4 sm:pr-6 text-right text-sm font-medium'
                                )}
                              >
                                <button
                                  type="button"
                                  id={reviewer.id}
                                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                                  disabled={reviewer.requests.length}
                                  onClick={(evt) => {
                                    askForReview(evt.target.id);
                                  }}
                                >
                                  Select
                                </button>
                                {index !== 0 ? <div className="absolute right-6 left-0 -top-px h-px bg-gray-200" /> : null}
                              </td>
                            </tr>
                          ))}
                        </tbody>


                      </table>
                    }
                  </div>
                </div>

                TODO: Waiver Button here (DB: add column. reviewWaiver T/F)


                <div className="sm:items-start sm:gap-4 sm:border-t sm:border-gray-200">
                  <div className="mt-6 space-y-10 divide-y divide-gray-200 border-gray-200 pb-10">
                    TODO: No reviews yet (when reviews array is empty)
                    {reviews.map((review) => (
                      <div key={review.id} className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8">
                        <div className="lg:col-span-8 lg:col-start-5 ">

                          {/* Clarity: 발표자료 내용이 명확/명료하게 작성되어 청중들에게 쉽게 정보를 전달할 수 있는지. 
Integrity: 발표자료가 주제에 맞게 통일성 있게 구성되어 있는지? 
Informative: 발표자료의 내용이 유익한지? 
Verbosity: 발표자료의 길이가 20분 발표에 적절한지?
*/}
                          <div className="">
                            <h3 className="text-sm font-medium text-gray-900">{review.title}</h3>

                            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3">
                              <div className="flex flex-col items">
                                <span className="text-sm font-small text-gray-700">Clarity </span>
                                <div className="flex items-center">
                                  {[0, 1, 2, 3, 4].map((rating) => (
                                    <StarIcon
                                      key={rating}
                                      className={classNames(
                                        review.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                                        'h-5 w-5 flex-shrink-0'
                                      )}
                                      aria-hidden="true"
                                    />
                                  ))}
                                  <p className="ml-3 text-sm text-gray-700">
                                    {review.rating}
                                    <span className="sr-only"> out of 5 stars</span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col items">
                                <span className="text-sm font-small text-gray-700">Educative </span>
                                <div className="flex items-center">
                                  {[0, 1, 2, 3, 4].map((rating) => (
                                    <StarIcon
                                      key={rating}
                                      className={classNames(
                                        review.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                                        'h-5 w-5 flex-shrink-0'
                                      )}
                                      aria-hidden="true"
                                    />
                                  ))}
                                  <p className="ml-3 text-sm text-gray-700">
                                    {review.rating}
                                    <span className="sr-only"> out of 5 stars</span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col items">
                                <span className="text-sm font-small text-gray-700">Informative </span>
                                <div className="flex items-center">
                                  {[0, 1, 2, 3, 4].map((rating) => (
                                    <StarIcon
                                      key={rating}
                                      className={classNames(
                                        review.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                                        'h-5 w-5 flex-shrink-0'
                                      )}
                                      aria-hidden="true"
                                    />
                                  ))}
                                  <p className="ml-3 text-sm text-gray-700">
                                    {review.rating}
                                    <span className="sr-only"> out of 5 stars</span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col items">
                                <span className="text-sm font-small text-gray-700">Measure 4 </span>
                                <div className="flex items-center">
                                  {[0, 1, 2, 3, 4].map((rating) => (
                                    <StarIcon
                                      key={rating}
                                      className={classNames(
                                        review.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                                        'h-5 w-5 flex-shrink-0'
                                      )}
                                      aria-hidden="true"
                                    />
                                  ))}
                                  <p className="ml-3 text-sm text-gray-700">
                                    {review.rating}
                                    <span className="sr-only"> out of 5 stars</span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col items">
                                <span className="text-sm font-small text-gray-700">Overall </span>
                                <div className="flex items-center">
                                  {[0, 1, 2, 3, 4].map((rating) => (
                                    <StarIcon
                                      key={rating}
                                      className={classNames(
                                        review.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                                        'h-5 w-5 flex-shrink-0'
                                      )}
                                      aria-hidden="true"
                                    />
                                  ))}
                                  <p className="ml-3 text-sm text-gray-700">
                                    {review.rating}
                                    <span className="sr-only"> out of 5 stars</span>
                                  </p>
                                </div>
                              </div>


                            </div>

                            <div
                              className="mt-6 space-y-6 text-sm text-gray-500"
                              dangerouslySetInnerHTML={{ __html: review.content }}
                            />
                          </div>
                        </div>

                        <div className="mt-6 flex items-center text-sm lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start xl:col-span-3">
                          <p className="font-medium text-gray-900">{review.author}</p>
                          <time
                            dateTime={review.datetime}
                            className="ml-4 border-l border-gray-200 pl-4 text-gray-500 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0"
                          >
                            {review.date}
                          </time>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
            : <></>}



          {seminarData?.mySeminarSubmission.progress >= 2 ?
            <div className="space-y-6 divide-y divide-gray-200 pt-8 sm:space-y-5 sm:pt-10">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Finalize</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Finalize your presentation material.
                </p>
              </div>
              <div className="space-y-6 divide-y divide-gray-200 sm:space-y-5">

              </div>
            </div> : <></>
          }


          {/* <div className="space-y-6 divide-y divide-gray-200 pt-8 sm:space-y-5 sm:pt-10">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              We'll always let you know about important changes, but you pick what else you want to hear about.
            </p>
          </div>
          <div className="space-y-6 divide-y divide-gray-200 sm:space-y-5">
            <div className="pt-6 sm:pt-5">
              <div role="group" aria-labelledby="label-email">
                <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4">
                  <div>
                    <div className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700" id="label-email">
                      By Email
                    </div>
                  </div>
                  <div className="mt-4 sm:col-span-2 sm:mt-0">
                    <div className="max-w-lg space-y-4">
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="comments"
                            name="comments"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="comments" className="font-medium text-gray-700">
                            Comments
                          </label>
                          <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="candidates"
                            name="candidates"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="candidates" className="font-medium text-gray-700">
                            Candidates
                          </label>
                          <p className="text-gray-500">Get notified when a candidate applies for a job.</p>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="offers"
                            name="offers"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="offers" className="font-medium text-gray-700">
                            Offers
                          </label>
                          <p className="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 sm:pt-5">
              <div role="group" aria-labelledby="label-notifications">
                <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4">
                  <div>
                    <div
                      className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                      id="label-notifications"
                    >
                      Push Notifications
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="max-w-lg">
                      <p className="text-sm text-gray-500">These are delivered via SMS to your mobile phone.</p>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="push-everything"
                            name="push-notifications"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-500"
                          />
                          <label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
                            Everything
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="push-email"
                            name="push-notifications"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-500"
                          />
                          <label htmlFor="push-email" className="ml-3 block text-sm font-medium text-gray-700">
                            Same as email
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="push-nothing"
                            name="push-notifications"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-500"
                          />
                          <label htmlFor="push-nothing" className="ml-3 block text-sm font-medium text-gray-700">
                            No push notifications
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}


        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              onClick={(e) => {
                scrollToTop();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </div>
      </form >
      <Notification props={{ message, isNotify, setIsNotify }} />
    </>
  )
}