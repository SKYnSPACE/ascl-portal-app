import { useEffect, useState } from 'react'

import useSWR from "swr";

import { format, parseISO } from "date-fns";

import { Tab } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function groupBy(objectArray, property) {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];
    const curGroup = acc[key] ?? [];

    return { ...acc, [key]: [...curGroup, obj] };
  }, {});
}

function ScheduleTabbed({schedule}) {
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
      <Tab.List className="-mx-4 flex gap-x-2 gap-y-6 overflow-x-auto pl-4 pb-4 sm:mx-0 sm:flex-col sm:pb-0 sm:pl-0 sm:pr-8">
        {({ selectedIndex }) =>
          schedule?.map((day, dayIndex) => (
            <div
              key={day.isoDate}
              className={classNames(
                'relative w-3/4 flex-none pr-4 sm:w-auto sm:pr-0',
                dayIndex !== selectedIndex && 'opacity-50'
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
        {schedule?.map((day) => (
          <Tab.Panel
            key={day.isoDate}
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
        <time dateTime={day.isoDate}>{day.date}</time>
      </h3>
      {/* <p className="mt-1.5 text-base tracking-tight text-gray-500">
        {day.summary}
      </p> */}
    </>
  )
}

function TimeSlots({ day, className }) {
  return (
    <ol
      role="list"
      className={classNames(
        className,
        'space-y-8 bg-white/60 py-8 px-10 text-center shadow-lg shadow-blue-900/30 backdrop-blur border border-gray-300'
      )}
    >
      {day.timeSlots.map((timeSlot, timeSlotIndex) => (
        <li
          key={timeSlot?.id}
          aria-label={`${timeSlot?.seminar?.presentedBy?.name} talking about ${timeSlot?.seminar?.title} at ${timeSlot.startsAt} - ${timeSlot.endsAt} KST`}
        >
          {timeSlotIndex > 0 && (
            <div className="mx-auto mb-8 h-px w-48 bg-indigo-500/10" />
          )}
          <h4 className="text-lg font-semibold tracking-tight text-slate-900">
            {timeSlot?.isBreak ? "Break Time" : timeSlot?.seminar?.presentedBy?.name ? timeSlot?.seminar?.presentedBy?.name : "EMPTY"}
          </h4>
          
            <p className="mt-1 tracking-tight text-slate-700">
            {timeSlot?.isBreak ? timeSlot?.note : timeSlot?.seminar?.title ? timeSlot?.seminar?.title : "--------"}
            </p>
          
          <p className="mt-1 font-mono text-sm text-slate-500">
            <time dateTime={`${day.isoDate}T${timeSlot.startsAt}-08:00`}>
              {timeSlot.startsAt}
            </time>{' '}
            -{' '}
            <time dateTime={`${day.isoDate}T${timeSlot.endsAt}-08:00`}>
              {timeSlot.endsAt}
            </time>{' '}
            KST
          </p>
        </li>
      ))}
    </ol>
  )
}

function ScheduleStatic({schedule}) {
  return (
    <div className="hidden lg:grid lg:grid-cols-3 lg:gap-x-8">
      {schedule?.map((day) => (
        <section key={day.isoDate}>
          <DaySummary day={day} />
          <TimeSlots day={day} className="mt-4" />
        </section>
      ))}
    </div>
  )
}

export function Schedule() {
  const { data: currentSlotsData, error: getCurrentSlotsError, isLoading: getCurrentSlotsLoading, mutate } = useSWR('/api/slot/current');
  const [schedule, setScehdule] = useState([]);

  useEffect(() => {
    if (currentSlotsData?.slots) {
      let schedule = [];

      const grouppedSlots = groupBy(currentSlotsData.slots, "date");
      const dates = Object.keys(grouppedSlots);
      dates.map((date) => {
        schedule.push({
          isoDate: date,
          date: format(parseISO(date), "MMMM d"),
          timeSlots: grouppedSlots[date],
        })
      });

      setScehdule(schedule);
      console.log(schedule)
    }
  }, [currentSlotsData])

  return (
    <section id="schedule" aria-label="Schedule" className="py-2">
      <div className="relative z-10">
        <div className="mx-2 max-w-2xl lg:max-w-4xl">
          <h3 className="font-display text-xl text-center font-medium tracking-tighter text-sky-600 sm:text-xl">
            2022 - Winter
          </h3>
          <h2 className="font-display text-3xl text-center font-medium tracking-tighter text-gray-800 sm:text-3xl">
            Lab. Seminar Schedule
          </h2>
          <p className="mt-2 font-display text-m tracking-tight text-gray-600">
            Presentation time can be selected once you have completed your presentation materials on the submission page (first-come, first-served basis). <br />
            If you need to adjust the presentation time, please discuss the matter directly with the presenter or contact the Lab manager.
          </p>
        </div>
      </div>
      <div className="relative mt-8 sm:mt-8">

        {schedule.length != 0 ?
          <div className="relative">
            <ScheduleTabbed schedule={schedule} />
            <ScheduleStatic schedule={schedule} />
          </div>
          :
          <div className="relative">
            <div className="text-center my-36">
              <p className="mt-1 text-4xl font-bold tracking-tight text-sky-600">
                No schedules
              </p>
              <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
                Ask for the Lab manager or staffs in charge to set a seminar slots(timetable).
              </p>
            </div>
          </div>
        }
      </div>
    </section>
  )
}
