import { Dialog } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const PayMethods = {
  C: "카드결제",
  T: "세금계산서",
  P: "구매팀",
}
const Categories = {
  MPE: "재료비",
  CPE: "전산처리비",
  DTE: "국내출장비",
  OTE: "해외출장비",
  ME: "회의비",
  AE: "수용비",
  NS: "지정요망",
}

export default function PurchaseRequestPendingModal({ props }) {
  const { modal, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage, selectedRequest } = { ...props };

  const statusStyles = {
    pending: 'bg-sky-50 text-sky-700',
    processing: 'bg-yellow-50 text-yellow-700', //accepted, yet incomplete
    completed: 'bg-green-50 text-green-700',
    delayed: 'bg-red-50 text-red-700',
    declined: 'bg-gray-50 text-gray-700',
  }

  return (
    <Dialog
      as="div"
      className="fixed z-10 inset-0 overflow-y-auto"
      open={(modal.kind == isModalOpen.kind && modal.status == isModalOpen.status)}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="flex items-end justify-center min-h-screen pt-20 px-4 pb-20 text-center sm:block">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg sm:w-full sm:p-6">
          <div className={classNames("mx-auto flex items-center justify-center h-12 w-12 rounded-full", statusStyles[selectedRequest.status])}>
            {selectedRequest?.icon ?
              <selectedRequest.icon
                className={classNames("h-6 w-6")}
                aria-hidden="true"
              />
              : <></>}
          </div>

          <div className="mt-3 text-center">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium text-gray-900"
            >
              {modal.name}
            </Dialog.Title>
          </div>
          <Dialog.Description className="mt-4">
            {/* {modal.detail} */}
          </Dialog.Description>

          <div className="flex flex-col items-center">

            <div className="w-full overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="px-4 py-3 sm:px-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{selectedRequest?.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{selectedRequest?.name}</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-2 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Category(세목)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{Categories[selectedRequest?.category]}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Item/Qty.(품목/수량)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.item} / x{selectedRequest?.quantity}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Details(상세)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.details}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Total Price(총액)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.amount}{selectedRequest?.currency} ({PayMethods[selectedRequest?.payMethod]})</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-4">
                    <dt className="text-sm font-medium text-gray-500">Due(처리기한)</dt>
                    <dd className="mt-0 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{selectedRequest?.date}</dd>
                  </div>

                </dl>
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setIsModalOpen(false);
                }}>
                Close
              </button>
            </div>

          </div>



        </div>
      </div>
    </Dialog>

  );
}