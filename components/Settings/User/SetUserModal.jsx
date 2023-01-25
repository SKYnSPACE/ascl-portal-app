import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

import { useForm } from "react-hook-form";

import ComboBoxSimple from "../../ComboBoxSimple";

import useMutation from "../../../libs/frontend/useMutation";
import { classNames } from '../../../libs/frontend/utils'

const Duties = {
  seminar: 0b10000000,
  publications: 0b01000000,

  server: 0b00010000,
  computer: 0b00001000,

  safety: 0b00000010,
  news: 0b00000001,
}

function objectArrayKeyChanger(objectArray) {
  if (!objectArray) return [{ id: null, option: null }];
  return objectArray.map(({ userNumber, name }) => ({ id: userNumber, option: name }))
}

function collectUserDataById(users, id) {
  // console.log(users)
  if (!users) return;
  return users.find(user => user.userNumber === id);
}

function getDutyNumber(props) {
  const { seminar, publications, server, computer, safety, news } = { ...props };
  return ((seminar && Duties.seminar) +
    (publications && Duties.publications) +
    (server && Duties.server) +
    (computer && Duties.computer) +
    (safety && Duties.safety) +
    (news && Duties.news));
}

export default function SetUserModal({ props }) {
  const { action, usersData, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage } = { ...props };

  const [selectedItem, setSelectedItem] = useState({});
  const [userToEdit, setUserToEdit] = useState(null);

  const { register, control, handleSubmit, setValue, reset } = useForm();
  const [setUser, { loading, data, error }] = useMutation("/api/settings/user/set");

  const onValid = (validForm) => {
    if (loading) return;
    // console.log({ ...validForm, id: userToEdit.id })
    setUser({
      ...validForm,
      duties: getDutyNumber(validForm),
      id: userToEdit.id
    });
  }

  useEffect(
    () => {
      // console.log(collectUserDataById(usersData?.users, selectedItem?.id));
      setUserToEdit(collectUserDataById(usersData?.users, selectedItem?.id));
    }, [selectedItem])

  useEffect(() => {

    if (userToEdit) {
      setValue("position", userToEdit.position.toString());
      setValue("seminar", userToEdit.duties & Duties.seminar);
      setValue("publications", userToEdit.duties & Duties.publications);
      setValue("server", userToEdit.duties & Duties.server);
      setValue("computer", userToEdit.duties & Duties.computer);
      setValue("safety", userToEdit.duties & Duties.safety);
      setValue("news", userToEdit.duties & Duties.news);
    }
  }, [userToEdit]);


  useEffect(() => {
    if (data?.ok) {
      setMessage(
        { type: 'success', title: 'Successfully Saved!', details: 'Setting user completed. Wait for the page reload.', }
      )
      setIsNotify(true);
      reset();
      setIsModalOpen(false);
    }
  }, [data])

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

          <div className="mt-1 text-center">
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


          <form className="mt-2 flex flex-col items-center" onSubmit={handleSubmit(onValid)}>

            {usersData ?
              <>
                <div className="w-full">
                  <label htmlFor="userNumber" className="text-sm">
                    User Name
                  </label>
                  <ComboBoxSimple list={objectArrayKeyChanger(usersData?.users)} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
                </div>



                <div className="w-full mt-2">
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <select
                    id="position"
                    name="position"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    {...register("position", {
                      required: "Position is required.",
                    })}
                  >
                    <option value="0">Guest</option>
                    <option value="1">Part-time Researcher</option>
                    <option value="2">Full-time Researcher</option>
                    <option value="3">Account Manager</option>
                    <option value="4">Team Leader</option>
                    <option value="5">Lab. Manager</option>
                    <option value="6">Secretary</option>
                    <option value="7">Professor</option>

                  </select>
                </div>




                <div className="w-full mt-2">
                  <label className="text-sm">
                    Duties
                  </label>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        {...register("seminar")}
                        id="seminar"
                        aria-describedby="seminar-description"
                        name="seminar"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="seminar" className="font-medium text-gray-700">
                        랩세미나
                      </label>
                      <p id="seminar-description" className="text-gray-500">
                        랩세미나 공지, 발표자료 취합/인쇄/백업, 행사 준비 등.
                      </p>
                    </div>

                  </div>
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        {...register("publications")}
                        id="publications"
                        aria-describedby="publications-description"
                        name="publications"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="publications" className="font-medium text-gray-700">
                        실적관리
                      </label>
                      <p id="publications-description" className="text-gray-500">
                        논문, 졸업생 청산 보고서 관리 등.
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        {...register("server")}
                        id="server"
                        aria-describedby="server-description"
                        name="server"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="server" className="font-medium text-gray-700">
                        서버관리
                      </label>
                      <p id="server-description" className="text-gray-500">
                        홈페이지/데이터 서버 관리, 과제 데이터 등 정보보안.
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        {...register("computer")}
                        id="computer"
                        aria-describedby="computer-description"
                        name="computer"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="computer" className="font-medium text-gray-700">
                        PC관리
                      </label>
                      <p id="computer-description" className="text-gray-500">
                        컴퓨터 및 전산처리용품 구입/관리, IP관리 등.
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        {...register("safety")}
                        id="safety"
                        aria-describedby="safety-description"
                        name="safety"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="safety" className="font-medium text-gray-700">
                        안전관리
                      </label>
                      <p id="safety-description" className="text-gray-500">
                        안전팀 POC. 안전관련 공지전파, 교육, 서류 작성 등.
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        {...register("news")}
                        id="news"
                        aria-describedby="news-description"
                        name="news"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="news" className="font-medium text-gray-700">
                        뉴스레터
                      </label>
                      <p id="news-description" className="text-gray-500">
                        학과사무실 POC. 연구실 홍보자료 작성 등.
                      </p>
                    </div>
                  </div>

                </div>

              </> : <></>}



            <div className="mt-5 sm:mt-6">
              <button
                className="group relative mx-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#2980b9] font-medium text-white hover:bg-[#aacae6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] text-sm"
                disabled={loading}
                type="submit"
              >
                {loading ?
                  <span className="flex items-center text-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>processing...</span>
                  : <span>Confirm</span>}
              </button>
              <button
                className="mx-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2980b9] text-sm"
                onClick={(e) => {
                  setSelectedItem({});
                  reset();
                  setIsModalOpen(false);
                }}>
                Cancel
              </button>
            </div>




          </form>


        </div>
      </div>

    </Dialog>











  );
}