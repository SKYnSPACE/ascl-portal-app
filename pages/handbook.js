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
    //TODO: category:
    question: '연구실을 들어오는 법?',
    answer: '출입문으로 들어오시면 됩니다.',
  },
  {
    question: '연구실을 빠져 나가는 법?',
    answer:
      '출입문으로 나가시면 됩니다.',
  },
  {
    question: '연구실 출퇴근 시간은?',
    answer:
      '00시 출근, 23시 퇴근.',
  },
  // More questions...
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Handbook() {
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
                      {faqs.map((faq) => (
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
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">About Lab. Seminar</h2>
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
                      {faqs.map((faq) => (
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
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">About purchasing</h2>
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
                      {faqs.map((faq) => (
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
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">About business trip</h2>
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
                      {faqs.map((faq) => (
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