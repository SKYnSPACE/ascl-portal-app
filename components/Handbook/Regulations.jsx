import {
  BuildingOffice2Icon,
  BriefcaseIcon,
  CreditCardIcon,
  PresentationChartBarIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline'

const subNavigation = [
  { name: 'Life in ASCL', href: '#', icon: BuildingOffice2Icon, current: true },
  { name: 'Seminar', href: '#', icon: PresentationChartBarIcon, current: false },
  { name: 'Purchasing', href: '#', icon: CreditCardIcon, current: false },
  { name: 'Business Trip', href: '#', icon: BriefcaseIcon, current: false },
]

const faqs = [
  {
    category: 'life',
    question: '연구실 출/퇴근 시간은?',
    answer: (
      <div>
        우리 연구실은 월~금요일 오전 10시 출근을 원칙으로 합니다. (주말/공휴일은 휴무) <br />
        별도의 일이 없는 한 본인의 자리로 10시까지 출근합시다! 병원 진료, 개인적인 업무로 자리를 비워야 할 때는 연구실 단체톡방이나 주변 사람들에게 자리 비운다는 사실을 꼭 알려줍시다!
      </div>
    ),
  },
  {
    category: 'life',
    question: '휴가(연차)는 어떻게 사용할 수 있나요?',
    answer: (
      <ol className="list-outside list-decimal">
        <li>연차를 쓸때는 연차 사용 최소 2주전 먼저 자신과 함께 일하는 연구실 동료들에게 연차 사용 한다는 사실을 알린뒤 과제 및 업무 조율이 가능한지 확인합니다.</li>
        <li>이후 동료들과의 업무 조율이 끝났다면 교수님께 연차 사용 1주일 전 연차 사용 메일을 보내면 됩니다!</li>
        <li>연차일에 쉽니다!</li>
      </ol>
    ),
  },

  // SEMINAR
  {
    category: 'seminar',
    question: '랩 세미나란?',
    answer:
      '랩 세미나는 각 개인별 현재 진행하고 있는 본인의 연구 성과 및 현황을 공유하는 자리이며 한학기 에 한번, 여름/겨울 방학에 진행합니다. 연구실 전원 참석과 발표를 기본으로 하되, 석사/박사 신입생 첫학기의 경우 발표가 면제(석사가 박사로 진학한 경우에는 면제되지 않음)됩니다. 학생 1인당 발표시간은 40분(30분 발표, 10분 질의응답) 입니다. ',
  },
  {
    category: 'seminar',
    question: '랩 세미나 발표자료 작성 요령은?',
    answer:
      '발표자료 양식은 자유이며, 자료의 내용은 영문으로 작성합니다. 단, 발표는 한국어 또는 영어로 진행합니다.',
  },
  {
    category: 'seminar',
    question: '랩 세미나 준비 요령은?',
    answer: (
      <>
      랩 세미나 준비는 연구실 총무의 지도 하에 석사과정 학생들이 진행합니다.
      <ol className="list-outside list-decimal">
        <li>랩세미나 공지</li>
        <p>내용작성.</p>
        <li>발표장소(강의실/세미나실) 예약</li>
        <p>내용작성.</p>
        <li>발표자료 출력</li>
        <p>내용작성.</p>
        <li>식사 예약</li>
        <p>내용작성.</p>
        <li>발표자료 백업</li>
        <p>내용작성.</p>
      </ol>
      </>
    ),
  },

  // PURCHASING
  {
    category: 'purchase',
    question: '연구에 필요한 물품을 구입하기 위한 절차는?',
    answer: (
      <ol className="list-outside list-decimal">
        <li>계정 문의</li>
        <p>내용작성.</p>
        <li>결제 진행</li>
        <ul className="list-inside list-none">
          <li>직접구매 &gt; 아래의 직접구매 방법을 참조.</li>
          <li>구매요청 &gt; 아래의 구매요청 방법을 참조.</li>
        </ul>
        <li>비용 증빙</li>
      </ol>
    ),
  },
  {
    category: 'purchase',
    question: '직접구매 방법',
    answer:
      '내용 작성.',
  },
  {
    category: 'purchase',
    question: '구매요청 방법',
    answer: (
      <ul className="list-inside list-disc">
        <li>KAIST Portal(ERP)에 접속</li>
        <li>비용/구매</li>
        <li>구매요청</li>
      </ul>
    ),
  },

  // BUSINESS TRIP
  {
    category: 'business-trip',
    question: '출장신청 절차는 어떻게 되나요?',
    answer: (
      <ol className="list-outside list-decimal">
        <li>출장 신청</li>
        <ul className="list-inside list-none">
          <li>process 1</li>
          <li>process 2</li>
          <li>process 3</li>
        </ul>
        <li>출장 증빙</li>
        <li>기타 증빙 (학회 등록비 등)</li>
      </ol>
    ),
  },

]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Regulations() {
  return (
    <main className="relative -mt-32">

      <div className="mx-auto max-w-7xl px-4 mb-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Handbook</h1>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">


        <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
          <section aria-labelledby="lab-life">
            <div className="bg-white shadow sm:overflow-hidden sm:rounded-md">
              <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
                <div className="py-6 px-4 sm:p-6 lg:grid lg:grid-cols-3 lg:gap-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Life in ASCL</h2>
                    <p className="mt-4 text-lg text-gray-500">
                      Can’t find the answer you’re looking for? Reach out to our Lab. manager{' '}
                      <a href="#" className="font-medium text-blue-600 hover:text-indigox-500">
                        Lamsu Kim
                      </a>{' '}
                      for the help.
                    </p>
                  </div>
                  <div className="mt-12 lg:col-span-2 lg:mt-0">
                    <dl className="space-y-12">
                      {faqs.filter((faq) => faq.category == 'life').map((faq) => (
                        <div key={faq.question}>
                          <dt className="text-lg font-medium leading-6 text-gray-900">{faq.question}</dt>
                          <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section aria-labelledby="lab-seminar">
            <div className="bg-white shadow sm:overflow-hidden sm:rounded-md">
              <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
                <div className="py-6 px-4 sm:p-6 lg:grid lg:grid-cols-3 lg:gap-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Lab. Seminar</h2>
                    <p className="mt-4 text-lg text-gray-500">
                      Can’t find the answer you’re looking for? Reach out to our Lab. manager{' '}
                      <a href="#" className="font-medium text-blue-600 hover:text-indigox-500">
                        Lamsu Kim
                      </a>{' '}
                      for the help.
                    </p>
                  </div>
                  <div className="mt-12 lg:col-span-2 lg:mt-0">
                    <dl className="space-y-12">
                      {faqs.filter((faq) => faq.category == 'seminar').map((faq) => (
                        <div key={faq.question}>
                          <dt className="text-lg font-medium leading-6 text-gray-900">{faq.question}</dt>
                          <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section aria-labelledby="lab-life">
            <div className="bg-white shadow sm:overflow-hidden sm:rounded-md">
              <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
                <div className="py-6 px-4 sm:p-6 lg:grid lg:grid-cols-3 lg:gap-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Purchasing</h2>
                    <p className="mt-4 text-lg text-gray-500">
                      Can’t find the answer you’re looking for? Reach out to our account manager{' '}
                      <a href="#" className="font-medium text-blue-600 hover:text-indigox-500">
                        Mingi Mun
                      </a>{' '}
                      for the help.
                    </p>
                  </div>
                  <div className="mt-12 lg:col-span-2 lg:mt-0">
                    <dl className="space-y-12">
                      {faqs.filter((faq) => faq.category == 'purchase').map((faq) => (
                        <div key={faq.question}>
                          <dt className="text-lg font-medium leading-6 text-gray-900">{faq.question}</dt>
                          <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section aria-labelledby="lab-life">
            <div className="bg-white shadow sm:overflow-hidden sm:rounded-md">
              <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
                <div className="py-6 px-4 sm:p-6 lg:grid lg:grid-cols-3 lg:gap-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Business trip</h2>
                    <p className="mt-4 text-lg text-gray-500">
                      Can’t find the answer you’re looking for? Reach out to our account manager{' '}
                      <a href="#" className="font-medium text-blue-600 hover:text-indigox-500">
                        Mingi Mun
                      </a>{' '}
                      for the help.
                    </p>
                  </div>
                  <div className="mt-12 lg:col-span-2 lg:mt-0">
                    <dl className="space-y-12">
                      {faqs.filter((faq) => faq.category == 'business-trip').map((faq) => (
                        <div key={faq.question}>
                          <dt className="text-lg font-medium leading-6 text-gray-900">{faq.question}</dt>
                          <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </div>

      </div>

    </main >
  )
}