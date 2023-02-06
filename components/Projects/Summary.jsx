import { useState, useEffect } from "react";
import useSWR from "swr";

import { Chart } from 'react-google-charts';

import { format, differenceInDays, parseISO } from "date-fns";


const chartData = [
  ["From", "To", "Weight"],

  ["UAV", "무인이동체 고장대응 및...", 100],
  ["UAV", "디지털지형항법 알고리즘...", 100],
  ["UAV", "미래 전장 응용을 위한...", 100],
  ["UAV", "산업수요기반 고효율 안전...", 100],
  ["UAV", "대전차용 표적조준 알고리즘...", 100],
  ["UAV", "직격비행체 성능분석도구...", 100],
  ["UAV", "TA/TF 운용모의 시뮬레이터...", 100],
  ["UAV", "달탐사 모빌리티 개발을 ...", 100],
  ["UAV", "FLCC 비행제어법칙 ...", 100],
  ["UAV", "안보기술연구", 100],

  ["SAT", "위성개발과제 1", 100],
  ["SAT", "위성개발과제 2", 100],

  ["무인이동체 고장대응 및...", "이성헌", 100],
  ["디지털지형항법 알고리즘...", "박준우", 100],
  ["미래 전장 응용을 위한...", "이성헌", 100],
  ["산업수요기반 고효율 안전...", "박준우", 100],
  ["대전차용 표적조준 알고리즘...", "이성헌", 100],
  ["직격비행체 성능분석도구...", "박준우", 100],
  ["TA/TF 운용모의 시뮬레이터...", "이성헌", 100],
  ["달탐사 모빌리티 개발을 ...", "박준우", 100],
  ["FLCC 비행제어법칙 ...", "홍경우", 100],
  ["안보기술연구", "홍경우", 100],

  ["위성개발과제 1", "오승렬", 100],
  ["위성개발과제 2", "오승렬", 100],

  ["ASCL", "UAV", 1000],
  ["ASCL", "SAT", 200],
];
const options = {
  height: 500,
  sankey: {
    node: { width: 4 },
    // link: { colorMode: 'gradient' },
  },
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Summary() {

  const { data, mutate, error, isLoading } = useSWR('/api/project/summary');

  const [chartData, setChartData] = useState(["From", "To", "Weight"],);

  useEffect(() => {
    if (isLoading) return;
    if (data && data.ok) {
      // console.log(data);

      let chartData = [["From", "To", "Weight"],];
      let uavTeamWeight = 0;
      let satTeamWeight = 0;
      let allTeamWeight = 0;

      data?.projects?.map((project) => {
        chartData.push([project.teamInCharge, project.title, +project.scale]);
        if (project.teamInCharge == 'UAV') uavTeamWeight += project.scale;
        else if (project.teamInCharge == 'SAT') satTeamWeight += project.scale;
        else allTeamWeight += project.scale;

        const workersDenominator = 2 * project.managers?.length + project.staffs?.length;
        project.managers?.map((manager) => {
          chartData.push([project.title, manager.user?.name, +2 * project.scale / workersDenominator])
        })
        project.staffs?.map((staff) => {
          chartData.push([project.title, staff.user?.name, +project.scale / workersDenominator])
        })
        // console.log(workersCount)

      })

      if (uavTeamWeight) chartData.push(["ASCL", "UAV", +uavTeamWeight]);
      if (allTeamWeight) chartData.push(["ASCL", "ALL", +allTeamWeight])
      if (satTeamWeight) chartData.push(["ASCL", "SAT", +satTeamWeight])

      // console.log(chartData)
      setChartData(chartData);

    }
  }, [data])

  return (

    <div className="lg:flex lg:h-full lg:flex-col">


      {/* Project summary */}
      <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
        <section aria-labelledby="payment-details-heading">

          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="bg-white py-6 px-4 sm:p-6">
              <div>
                <h2 id="payment-details-heading" className="text-lg font-medium leading-6 text-gray-900">
                  ASCL Project Summary
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  To update project information, please contact with the Lab. manager.
                </p>
              </div>
              {data?.projects ?
                <Chart chartType="Sankey" data={chartData} options={options} />
                : <></>}
            </div>
          </div>

        </section>

        {/* Project #1 */}
        {/* TODO: Make multiple sections after inquiring user info. */}
        {data?.projects?.map((project) => {
          const daysLeft = differenceInDays(parseISO(project.endDate), new Date());
          const projectPeriod = differenceInDays(parseISO(project.endDate), parseISO(project.startDate));
          const remainingRate = daysLeft / projectPeriod;
          const elapsedRate = 1 - remainingRate;

          return (
            <section aria-labelledby="plan-heading" key={project.alias}>
              <div className="relative border-2 shadow sm:overflow-hidden sm:rounded-md">

                <div className="hidden xl:inline absolute top-4 right-4">
                  <span className={classNames(
                    remainingRate > 0.3 ?
                      "bg-sky-100 text-sky-800" : remainingRate > 0.1 ?
                        "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800",
                    "inline-flex items-center rounded-md px-2 py-2 text-3xl font-bold")}>
                    {daysLeft < 0 ? `D+${-daysLeft}` : `D-${daysLeft}`}
                  </span>
                </div>

                <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                  <div>
                    <h2 id="plan-heading" className="text-lg font-medium leading-6 text-gray-900">
                      {`[${project.alias}] ${project.title}`}
                    </h2>
                    <p className="mt-1 text-sm text-gray-800">

                      {`${project.managers?.sort((firstItem, secondItem) => firstItem.user.userNumber - secondItem.user.userNumber).map((manager) => manager.user.name).join('*, ')}*,
                    ${project.staffs?.sort((firstItem, secondItem) => firstItem.user.userNumber - secondItem.user.userNumber).map((staff) => staff.user.name).join(', ')}`}
                    </p>
                    <p className="mt-1 text-sm text-gray-300">

                      {/* {`${project.participants?.map((participant) => participant.user.name).join(', ')}`} */}
                      {`${project.participants?.sort((firstItem, secondItem) => firstItem.user.userNumber - secondItem.user.userNumber).map((participant) => participant.user.name).join(', ')}`}

                    </p>
                  </div>



                  <div className="mt-6 grid grid-cols-4 gap-6">
                    <div className="col-span-4 sm:col-span-2 whitespace-pre-wrap">
                      <p>{project.note}</p>
                    </div>

                    {/* <div className="col-span-4 sm:col-span-2">
                    <p>첨부파일(제안서 등)</p>
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <p>과제의 진행현황이나 특이사항을 공유해요. (채팅방?)</p>
                    <p>TODO: 과제 리스트 추가/제거</p>
                    <p>FORM 형식으로 변경</p>
                  </div> */}
                  </div>

                  <dl className="mt-5 grid grid-cols-2 border divide-y divide-gray-200 xl:grid-cols-6 md:grid-cols-4 md:divide-y-0 md:divide-x overflow-hidden rounded-lg bg-white shadow ">

                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-base font-semibold text-gray-900">재료비</dt>
                      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                        <div className="flex items-baseline text-2xl font-semibold text-sky-600">
                          {/* {`${(100*(1-project?.mpeBalance/project?.mpePlanned) || 0).toFixed(0)} %`} */}
                          {`${(project?.mpeExeRate || 0)} %`}
                          <span className="ml-2 text-sm font-medium text-gray-500">집행</span>
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-base font-semibold text-gray-900">전산처리비</dt>
                      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                        <div className="flex items-baseline text-2xl font-semibold text-sky-600">
                          {/* {`${(100*(1-project?.cpeBalance/project?.cpePlanned) || 0).toFixed(0)} %`} */}
                          {`${(project?.cpeExeRate || 0)} %`}
                          <span className="ml-2 text-sm font-medium text-gray-500">집행</span>
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-base font-semibold text-gray-900">국내출장비</dt>
                      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                        <div className="flex items-baseline text-2xl font-semibold text-sky-600">
                          {`${(project?.dteExeRate || 0)} %`}
                          <span className="ml-2 text-sm font-medium text-gray-500">집행</span>
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-base font-semibold text-gray-900">해외출장비</dt>
                      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                        <div className="flex items-baseline text-2xl font-semibold text-sky-600">
                          {/* {`${(100*(1-project?.oteBalance/project?.otePlanned) || 0).toFixed(0)} %`} */}
                          {`${(project?.oteExeRate || 0)} %`}
                          <span className="ml-2 text-sm font-medium text-gray-500">집행</span>
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-base font-semibold text-gray-900">회의비</dt>
                      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                        <div className="flex items-baseline text-2xl font-semibold text-sky-600">
                          {/* {`${(100*(1-project?.meBalance/project?.mePlanned) || 0).toFixed(0)} %`} */}
                          {`${(project?.meExeRate || 0)} %`}
                          <span className="ml-2 text-sm font-medium text-gray-500">집행</span>
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-base font-semibold text-gray-900">수용비</dt>
                      <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                        <div className="flex items-baseline text-2xl font-semibold text-sky-600">
                          {/* {`${(100*(1-project?.aeBalance/project?.aePlanned) || 0).toFixed(0)} %`} */}
                          {`${(project?.aeExeRate || 0)} %`}
                          <span className="ml-2 text-sm font-medium text-gray-500">집행</span>
                        </div>
                      </dd>
                    </div>
                    <div className="">
                    </div>
                    <div className="">
                    </div>
                  </dl>

                  {/* <div className="mx-auto">
                  <dl className="rounded-lg bg-white shadow-lg grid grid-cols-2 sm:grid sm:grid-cols-6">
                    <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                      <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">재료비</dt>
                      <dd className="order-1 text-2xl font-bold tracking-tight text-sky-600">{project.mpePlanned}</dd>
                    </div>
                    <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                      <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">전산비</dt>
                      <dd className="order-1 text-2xl font-bold tracking-tight text-sky-600">24/7</dd>
                    </div>
                    <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                      <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">출장(내)</dt>
                      <dd className="order-1 text-2xl font-bold tracking-tight text-sky-600">100k</dd>
                    </div>
                    <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                      <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">출장(외)</dt>
                      <dd className="order-1 text-2xl font-bold tracking-tight text-sky-600">100k</dd>
                    </div>
                    <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                      <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">회의비</dt>
                      <dd className="order-1 text-2xl font-bold tracking-tight text-sky-600">100k</dd>
                    </div>
                    <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                      <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">수용비</dt>
                      <dd className="order-1 text-2xl font-bold tracking-tight text-sky-600">100k</dd>
                    </div>
                  </dl>
                </div> */}

                </div>

                <div className="flex bg-gray-100 px-4 py-3 sm:px-6">
                  <div className="grow">
                    {remainingRate < 0 ?
                      <p className="text-sm text-red-500">과제기한이 경과하였습니다.</p> : <></>}
                    {((elapsedRate > 0.3) && (100 * elapsedRate > project?.aeExeRate + 10 || 0)) ||
                      ((elapsedRate > 0.9) && (100 * elapsedRate > project?.aeExeRate + 5 || 0)) ?
                      <p className="text-sm text-yellow-500">과제기간 대비 예산집행 실적이 부진합니다. (과제진행도: {(100 * elapsedRate).toFixed(1)}%) </p> : <></>}
                    {/* 평시: 10%허용, 완료기: 5% 차이 */}
                  </div>
                  <a href={`/projects/${project.alias}`}>
                  <button
                    type="button"
                    className="justify-center rounded-md border border-transparent bg-gray-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                    
                  >
                    Details
                  </button>
                  </a>
                </div>
              </div>
            </section>);
        })}

        {/* Project #2 */}
        {/* TODO: Make multiple sections after inquiring user info. */}
        {/* <section aria-labelledby="plan-heading">
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                <div>
                  <h2 id="plan-heading" className="text-lg font-medium leading-6 text-gray-900">
                    내가 참여중인 다른 이상한 과제
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    홍경우*, 박준우, 과제의, 참여자, 이름을, 여기에, 적어요.
                  </p>
                </div>



                <div className="mt-6 grid grid-cols-4 gap-6">
                  <div className="col-span-4 sm:col-span-2">
                    <p>과제에서 구입가능한 품목, 예산안, 잔액 등을 공유해요.</p>
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <p>첨부파일(제안서 등)</p>
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <p>과제의 진행현황이나 특이사항을 공유해요. (채팅방?)</p>
                  </div>


                </div>

              </div>


              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-gray-800 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  Post
                </button>
              </div>
            </div>
          </section> */}

      </div>

    </div>

  )
}