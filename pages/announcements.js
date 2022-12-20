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

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Announcements() {
  return (
    <main className="relative -mt-32">
      <div className="mx-auto max-w-7xl px-4 mb-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Announcements</h1>
      </div>
        <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
              <aside className="py-6 lg:col-span-3">
                <nav className="space-y-1">
                  {subNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-sky-50 border-sky-500 text-sky-700 hover:bg-sky-50 hover:text-sky-700'
                          : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                        'group border-l-4 px-3 py-2 flex items-center text-sm font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? 'text-sky-500 group-hover:text-sky-500'
                            : 'text-gray-400 group-hover:text-gray-500',
                          'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.name}</span>
                    </a>
                  ))}
                </nav>
              </aside>

              <form className="divide-y divide-gray-200 lg:col-span-9" action="#" method="POST">
                {/* Profile section */}
                <div className="py-6 px-4 sm:p-6 lg:pb-8">
                  <div>
                    <h2 className="text-lg font-medium leading-6 text-gray-900">Life in ASCL</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Will be updated soon.
                    </p>
                  </div>

                  
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
  )
}