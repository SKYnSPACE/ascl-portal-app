import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'

const people = [
  {
    name: 'Hyochoong Bang',
    status: 'Present',
    office: '기3300',
    currentLocation: '',
    email: 'hcbang@kaist.ac.kr',
    telephone: '+82-10-6296-1561',
    imageUrl:
      'http://ascl.kaist.ac.kr/images/sub020101.jpg',
  },
  {
    name: 'Seongheon Lee',
    status: 'Present',
    office: '유4116',
    currentLocation: '',
    email: 'skynspace@kaist.ac.kr',
    telephone: '+82-10-6296-1561',
    imageUrl:
      'https://avatars.githubusercontent.com/u/21105393?v=4',
  },
  {
    name: 'Taeyoung Kim',
    status: 'Absent',
    office: '기3316',
    currentLocation: '',
    email: 'tykim@kaist.ac.kr',
    telephone: '+82-',
    imageUrl:
      'http://ascl.kaist.ac.kr/files/attach/images/210/366/28f33cf51b43647862b5fbb8af839999.jpg',
  },
  {
    name: 'Taemin Shim',
    status: 'On business',
    office: '유4117',
    currentLocation: '',
    email: 'tmshim@kaist.ac.kr',
    telephone: '+82-',
    imageUrl:
      'http://ascl.kaist.ac.kr/files/attach/images/210/366/fa217c3b4ca472e250c2c0c0da668f5f.jpg',
  },
  {
    name: 'Taeho Kim',
    status: 'Personal affairs',
    office: '기2000',
    currentLocation: '',
    email: 'thkim@kaist.ac.kr',
    telephone: '+82-',
    imageUrl:
      'http://ascl.kaist.ac.kr/files/attach/images/210/366/5e49f293963950ca36ccf58c70cb4796.jpg',
  },

]

function classNames(...classes) {
  console.log(...classes)
  return classes.filter(Boolean).join(' ')
}

function getStatusColor(status) {
  switch (status) {
    case 'Present':
      return 'bg-sky-100 text-sky-800';
    case 'On business':
      return 'bg-green-100 text-green-800';
    case 'Personal affairs':
      return 'bg-yellow-100 text-yellow-800';
    case 'Absent':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function Attendance() {
  return (
    <ul status="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((person) => (
        <li key={person.email} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
          <div className={classNames(getStatusColor(person.status), 'rounded-t-lg text-center')}>
            {/* <span className={classNames(getStatusColor(person.status), 'inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium')}> */}
            <span className='inline-block flex-shrink-0 rounded-full px-2 py-0.5 text-sm font-medium'>
              {person.status}
            </span>
          </div>
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="truncate text-sm font-medium text-gray-900">{person.name}</h3>
              </div>
              <p className="mt-1 truncate text-sm text-gray-500">{person.office}</p>

            </div>
            <img className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" src={person.imageUrl} alt="" />

          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <a
                  href={`mailto:${person.email}`}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-3">Email</span>
                </a>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <a
                  href={`tel:${person.telephone}`}
                  className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-3">Call</span>
                </a>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}