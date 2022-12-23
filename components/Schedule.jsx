import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Tab } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const schedule = [
  {
    date: 'Feburary 4',
    dateTime: '2023-02-04',
    summary:
      'The first day of the seminar is focused on ... (여기에 발표자료 태그를 수집. e.g. UAV, SAT, CTRL, AI, ...)',
    timeSlots: [
      {
        name: 'Ronni Guilianelli',
        description: 'Phasellus iaculis nulla ac mauris sollicitudin, laoreet euismod dui faucibus.',
        start: '9:00AM',
        end: '10:00AM',
      },
      {
        name: 'EMPTY',
        description: 'TBD',
        start: '10:00AM',
        end: '11:00AM',
      },
      {
        name: 'EMPTY',
        description: 'TBD',
        start: '11:00AM',
        end: '12:00PM',
      },
      {
        name: 'Lunch Break',
        description: 'Menu: ?',
        start: '12:00PM',
        end: '1:00PM',
      },
      {
        name: 'EMPTY',
        description: 'TBD',
        start: '1:00PM',
        end: '2:00PM',
      },
      {
        name: 'EMPTY',
        description: 'TBD',
        start: '2:00PM',
        end: '3:00PM',
      },
      {
        name: 'EMPTY',
        description: 'TBD',
        start: '3:00PM',
        end: '4:00PM',
      },
    ],
  },
  {
    date: 'Feburary 5',
    dateTime: '2023-02-05',
    summary:
      'Next we spend the day talking about deceiving people with technology.',
    timeSlots: [
      {
        name: 'EMPTY',
        description: 'TBD',
        start: '9:00AM',
        end: '10:00AM',
      },
      {
        name: 'Hyochoong Bang',
        description: '프로젝트 담당자 할당 및 바람직한 랩 생활을 위한 교수님의 조언',
        start: '10:00AM',
        end: '11:00AM',
      },
      {
        name: 'EMPTY',
        description: 'TBD',
        start: '11:00AM',
        end: '12:00PM',
      },
      {
        name: 'Lunch Break',
        description: null,
        start: '12:00PM',
        end: '1:00PM',
      },
      {
        name: 'EMPTY',
        description: 'TBD',
        start: '1:00PM',
        end: '2:00PM',
      },
      {
        name: 'Junwoo Park',
        description: 'Latest development status report on ASCL Navigation system which outperforms DJI, PX4, and even VectorNav',
        start: '2:00PM',
        end: '3:00PM',
      },
      {
        name: 'EMPTY',
        description: 'TBD',
        start: '3:00PM',
        end: '4:00PM',
      },
    ],
  },
  {
    date: 'Feburary 6',
    dateTime: '2023-02-06',
    summary:
      'We close out the event previewing new techniques that are still in development.',
    timeSlots: [
      {
        name: 'Kyungwoo Hong',
        description: '지상통제 시스템 개발을 위한 리크루팅, 개발환경 구축과 HTML, CSS, JavaScript 강좌 계획 수립에 관하여',
        start: '9:00AM',
        end: '10:00AM',
      },
      {
        name: 'EMPTY',
        description: 'TBD',
        start: '10:00AM',
        end: '11:00AM',
      },
      {
        name: 'EMPTY',
        description: 'TBD',
        start: '11:00AM',
        end: '12:00PM',
      },
      {
        name: 'Lunch Break',
        description: null,
        start: '12:00PM',
        end: '1:00PM',
      },
      {
        name: '임철수',
        description: '달 탐사를 위한 로버 개발에 한 꼭지를 담당하고 싶은데 왜 기회를 주지 않는지 정말 답답한 마음을 담아, 로버 DM에 사용 가능한 유도, 제어, 항법 기술을 내가 만들었다.',
        start: '1:00PM',
        end: '2:00PM',
      },
      {
        name: 'EMPTY',
        description: 'TBD',
        start: '2:00PM',
        end: '3:00PM',
      },
      {
        name: '김남수',
        description: 'Closing: 내위로 내밑으로 다 집합.',
        start: '3:00PM',
        end: '4:00PM',
      },
    ],
  },
]

function ScheduleTabbed() {
  let [tabOrientation, setTabOrientation] = useState('horizontal')

  useEffect(() => {
    let smMediaQuery = window.matchMedia('(min-width: 640px)')

    function onMediaQueryChange({ matches }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }

    onMediaQueryChange(smMediaQuery)
    smMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      smMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  return (
    <Tab.Group
      as="div"
      className="mx-auto grid max-w-2xl grid-cols-1 gap-y-6 sm:grid-cols-2 lg:hidden"
      vertical={tabOrientation === 'vertical'}
    >
      <Tab.List className="-mx-4 flex gap-x-4 gap-y-10 overflow-x-auto pl-4 pb-4 sm:mx-0 sm:flex-col sm:pb-0 sm:pl-0 sm:pr-8">
        {({ selectedIndex }) =>
          schedule.map((day, dayIndex) => (
            <div
              key={day.dateTime}
              className={classNames(
                'relative w-3/4 flex-none pr-4 sm:w-auto sm:pr-0',
                dayIndex !== selectedIndex && 'opacity-70'
              )}
            >
              <DaySummary
                day={{
                  ...day,
                  date: (
                    <Tab className="[&:not(:focus-visible)]:focus:outline-none">
                      <span className="absolute inset-0" />
                      {day.date}
                    </Tab>
                  ),
                }}
              />
            </div>
          ))
        }
      </Tab.List>
      <Tab.Panels>
        {schedule.map((day) => (
          <Tab.Panel
            key={day.dateTime}
            className="[&:not(:focus-visible)]:focus:outline-none"
          >
            <TimeSlots day={day} />
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
}

function DaySummary({ day }) {
  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-gray-700">
        <time dateTime={day.dateTime}>{day.date}</time>
      </h3>
      <p className="mt-1.5 text-base tracking-tight text-gray-500">
        {day.summary}
      </p>
    </>
  )
}

function TimeSlots({ day, className }) {
  return (
    <ol
      role="list"
      className={classNames(
        className,
        'space-y-8 bg-white/60 py-14 px-10 text-center shadow-xl shadow-blue-900/30 backdrop-blur'
      )}
    >
      {day.timeSlots.map((timeSlot, timeSlotIndex) => (
        <li
          key={timeSlot.start}
          aria-label={`${timeSlot.name} talking about ${timeSlot.description} at ${timeSlot.start} - ${timeSlot.end} KST`}
        >
          {timeSlotIndex > 0 && (
            <div className="mx-auto mb-8 h-px w-48 bg-indigo-500/10" />
          )}
          <h4 className="text-lg font-semibold tracking-tight text-slate-900">
            {timeSlot.name}
          </h4>
          {timeSlot.description && (
            <p className="mt-1 tracking-tight text-slate-700">
              {timeSlot.description}
            </p>
          )}
          <p className="mt-1 font-mono text-sm text-slate-500">
            <time dateTime={`${day.dateTime}T${timeSlot.start}-08:00`}>
              {timeSlot.start}
            </time>{' '}
            -{' '}
            <time dateTime={`${day.dateTime}T${timeSlot.end}-08:00`}>
              {timeSlot.end}
            </time>{' '}
            KST
          </p>
        </li>
      ))}
    </ol>
  )
}

function ScheduleStatic() {
  return (
    <div className="hidden lg:grid lg:grid-cols-3 lg:gap-x-8">
      {schedule.map((day) => (
        <section key={day.dateTime}>
          <DaySummary day={day} />
          <TimeSlots day={day} className="mt-10" />
        </section>
      ))}
    </div>
  )
}

export function Schedule() {
  return (
    <section id="schedule" aria-label="Schedule" className="py-4 sm:py-12">
      <div className="relative z-10">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-4xl lg:pr-24">
          <h2 className="font-display text-3xl font-medium tracking-tighter text-gray-900 sm:text-3xl">
            2022학년도 겨울 랩세미나
          </h2>
          <p className="mt-4 font-display text-lg tracking-tight text-gray-700">
            발표 순서는 발표자료 준비가 완료된 사람들부터 선착순으로 할당됩니다. 발표 순서 조정이 필요한 경우 발표자와 직접 협의하시거나, 총무에게 연락하시기 바랍니다.
          </p>
        </div>
      </div>
      <div className="relative mt-8 sm:mt-12">

        <div className="relative">
          <ScheduleTabbed />
          <ScheduleStatic />
        </div>
      </div>
    </section>
  )
}
