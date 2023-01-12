import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

import { useForm } from "react-hook-form";

import PhoneInput from "react-phone-number-input/react-hook-form-input"

import ComboBoxSimple from "../../ComboBoxSimple";

import useMutation from "../../../libs/frontend/useMutation";

import { classNames } from '../../../libs/frontend/utils'

// function objectArrayKeyChanger(objectArray, originalKeys, newKeys){
function objectArrayKeyChanger(objectArray) {
  if (!objectArray) return [{id:null, option:null}];
  return objectArray.map(({ userNumber, name }) => ({ id: userNumber, option: name }))
}

// const countries = [
//   {"id": 1, "name": "Afghanistan"},
//   {"id": 2, "name": "Albania"},
//   {"id": 3, "name": "Algeria"},
//   {"id": 4, "name": "American Samoa"}
// ];
// const transformed = countries.map(({ id, name }) => ({ label: id, value: name }));

function collectUserDataById(users, id) {
  // console.log(users)
  if (!users) return;
  return users.find(user => user.userNumber === id);
}

export default function EditUserModal({ props }) {
  const [selectedItem, setSelectedItem] = useState({});
  const [userToEdit, setUserToEdit] = useState(null);

  const { action, usersData, isModalOpen, setIsModalOpen, isNotify, setIsNotify, message, setMessage } = { ...props };
  const { register, control, handleSubmit, setValue, reset } = useForm();
  const [editUser, { loading, data, error }] = useMutation("/api/settings/user/edit");

  const onValid = (validForm) => {
    if (loading) return;

    // console.log({...validForm, id: userToEdit.id})
    editUser({...validForm, id: userToEdit.id});
  }

  useEffect(
    () => {
      // console.log(collectUserDataById(usersData?.users, selectedItem?.id));
      setUserToEdit(collectUserDataById(usersData?.users, selectedItem?.id));
    }, [selectedItem])

  useEffect(() => {
    if (userToEdit) {
      setValue("userNumber", userToEdit.userNumber);
      setValue("email", userToEdit.email);
      setValue("phone", userToEdit.phone);
    }
  }, [userToEdit]);

  useEffect(()=>{
    if (data?.ok) {
      setMessage(
        { type: 'success', title: 'Successfully Saved!', details: 'Editing user completed. Wait for the page reload.', }
      )
      setIsNotify(true);
      reset();
      setIsModalOpen(false);
    }
    if (data?.error) {
      switch (data.error?.code) {
        case 'P1017':
          console.log("Connection Lost.")
          setMessage(
            { type: 'fail', title: 'Connection Lost.', details: "Database Server does not respond.", }
          )
        case 'P2002':
          console.log("Data is not unique.");
          setMessage(
            { type: 'fail', title: 'Editing user failed!', details: "You may entered someone else's Email or phone number.", }
          )
          setIsNotify(true);
        default:
          console.log("ERROR", data.error);
      }
    }
  },[data])
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


          <form className="mt-5 flex flex-col items-center" onSubmit={handleSubmit(onValid)}>


            {usersData ?
              <>
                <div className="w-full">
                  <label htmlFor="userNumber" className="text-sm">
                    User Name
                  </label>
                  <ComboBoxSimple list={objectArrayKeyChanger(usersData?.users)} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
                </div>


                <div className="w-full">
                  <div className="w-full">
                    <label htmlFor="userNumber" className="text-sm">
                      ID
                    </label>
                    <input
                      {...register("userNumber", {
                        required: "ID is required.",
                        maxLength: {
                          message: "The ID must be less than 9 numbers.",
                          value: 9,
                        },
                      })}
                      type="number"
                      name="userNumber"
                      id="userNumber"
                      required
                      className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="email" className="text-sm">
                      Email
                    </label>
                    <input
                      {...register("email", {
                        required: "Email is required.",
                        maxLength: {
                          message: "The Email must be less than 255 chars.",
                          value: 255,
                        },
                      })}
                      type="text"
                      name="email"
                      id="email"
                      required
                      className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"

                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="phone" className="text-sm">
                      Phone
                    </label>
                    <PhoneInput
                      className="my-1 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full border-gray-300 rounded-md"
                      // defaultCountry="KR" 
                      country="KR"
                      name="phone"
                      control={control}
                      rules={{ required: true }}
                    />
                  </div>
                </div>
              </>
              : <></>}



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