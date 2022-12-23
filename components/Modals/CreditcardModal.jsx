import { Dialog } from "@headlessui/react";

import { CheckIcon, ExclamationCircleIcon, HomeIcon, LocationMarkerIcon, RefreshIcon, PlusIcon, PlusSmIcon, TrashIcon } from '@heroicons/react/24/outline';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function CreditcardModal({props}) {
  const {action, isModalOpen, setIsModalOpen} = {...props};

  return (
    <Dialog
      as="div"
      className="fixed z-10 inset-0 overflow-y-auto"
      open={action.id == isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="flex items-end justify-center min-h-screen pt-32 px-4 pb-20 text-center sm:block">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div className={classNames("mx-auto flex items-center justify-center h-12 w-12 rounded-full", action.iconBackground)}>

            <action.icon
              className={classNames("h-6 w-6", action.iconForeground)}
              aria-hidden="true"
            />
          </div>

          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              {action.name}
            </Dialog.Title>
          </div>
          <Dialog.Description className="mt-4">
            {action.detail}
          </Dialog.Description>

          <div className="mt-5 flex flex-col items-center">
            <div className="w-full">
              <label htmlFor="title" className="text-sm">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"

              />
            </div>
            <div className="w-full">
              <label htmlFor="contents" className="text-sm">
                Contents
              </label>
              <input
                type="text"
                name="contents"
                id="contents"
                className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"

              />
            </div>
            <div className="w-full">
              <label htmlFor="altitude" className="text-sm">
                Altitude [m, AGL]
              </label>
              <input
                type="text"
                name="altitude"
                id="altitude"
                className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"

              />
            </div>
            <div className="w-full">
              <label htmlFor="speed" className="text-sm">
                Speed [m/s]
              </label>
              <input
                type="text"
                name="speed"
                id="speed"
                className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"

              />
            </div>


            <div className="mt-5 sm:mt-6">
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#2980b9] text-base font-medium text-white hover:bg-[#aacae6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] sm:text-sm"
                onClick={(e) => {}}
              >
                Confirm
              </button>
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9]   sm:text-sm"
                onClick={(e) => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>

          </div>



        </div>
      </div>
    </Dialog>

  );
}