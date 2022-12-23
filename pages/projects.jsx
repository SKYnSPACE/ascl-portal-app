import { Chart } from 'react-google-charts';

import {
  BuildingOffice2Icon,
  BriefcaseIcon,
  CreditCardIcon,
  PresentationChartBarIcon,
} from '@heroicons/react/24/outline'

const subNavigation = [
  { name: 'Life in ASCL', href: '#', icon: BuildingOffice2Icon, current: true },
  { name: 'Seminar', href: '#', icon: PresentationChartBarIcon, current: false },
  { name: 'Purchasing', href: '#', icon: CreditCardIcon, current: false },
  { name: 'Business Trip', href: '#', icon: BriefcaseIcon, current: false },
]

const data = [
  ["From", "To", "Weight"],

  ["ASCL", "UAV", 100],
  ["ASCL", "SAT", 20],

  ["UAV", "무인이동체 고장대응 및...", 10],
  ["UAV", "디지털지형항법 알고리즘...", 10],
  ["UAV", "미래 전장 응용을 위한...", 10],
  ["UAV", "산업수요기반 고효율 안전...", 10],
  ["UAV", "대전차용 표적조준 알고리즘...", 10],
  ["UAV", "직격비행체 성능분석도구...", 10],
  ["UAV", "TA/TF 운용모의 시뮬레이터...", 10],
  ["UAV", "달탐사 모빌리티 개발을 ...", 10],
  ["UAV", "FLCC 비행제어법칙 ...", 10],
  ["UAV", "안보기술연구", 10],

  ["SAT", "위성개발과제 1", 10],
  ["SAT", "위성개발과제 2", 10],

  ["무인이동체 고장대응 및...", "이성헌", 10],
  ["디지털지형항법 알고리즘...", "박준우", 10],
  ["미래 전장 응용을 위한...", "이성헌", 10],
  ["산업수요기반 고효율 안전...", "박준우", 10],
  ["대전차용 표적조준 알고리즘...", "이성헌", 10],
  ["직격비행체 성능분석도구...", "박준우", 10],
  ["TA/TF 운용모의 시뮬레이터...", "이성헌", 10],
  ["달탐사 모빌리티 개발을 ...", "박준우", 10],
  ["FLCC 비행제어법칙 ...", "홍경우", 10],
  ["안보기술연구", "홍경우", 10],

  ["위성개발과제 1", "오승렬", 10],
  ["위성개발과제 2", "오승렬", 10],

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

export default function Handbook() {
  return (
    <main className="relative -mt-32">

      <div className="mx-auto max-w-7xl px-4 mb-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Projects</h1>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">





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

                <Chart chartType="Sankey" data={data} options={options} />

              </div>
            </div>

          </section>

          {/* Project #1 */}
          {/* TODO: Make multiple sections after inquiring user info. */}
          <section aria-labelledby="plan-heading">
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                <div>
                  <h2 id="plan-heading" className="text-lg font-medium leading-6 text-gray-900">
                    다목적 호버바이크 개발
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    장광우*, 안형주, 과제의, 참여자, 이름을, 여기에, 적어요.
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
                    <p>TODO: 과제 리스트 추가/제거</p>
                    <p>FORM 형식으로 변경</p>
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
          </section>

          {/* Project #2 */}
          {/* TODO: Make multiple sections after inquiring user info. */}
          <section aria-labelledby="plan-heading">
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
          </section>

        </div>

      </div>
    </main>
  )
}