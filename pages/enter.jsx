import { useForm } from "react-hook-form";

import {
  LockClosedIcon,
  BriefcaseIcon,
  CreditCardIcon,
  PresentationChartBarIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline'


export default function Enter() {
  const { register, handleSubmit, setError } = useForm();
  const onValid = (data) => {
    console.log("Do something when the form is valid.");
    console.log(data);
    fetch("/api/users/enter",{
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      }
    })
    //TODO: setError("serverError", {message:"Server does not respond."})
    //TODO: setError("serverError", {message:"Password incorrect."})
   //TODO: resetField("password") 
  }
  //<p>{errors.serverError?.message}</p>
  const onInvalid = () => {
    console.log("Do something when the form is invalid.");
  }

  return (
    <main className="relative -mt-32">

      <div className="mx-auto max-w-7xl px-4 mb-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Sign In</h1>
      </div>

      <div className="space-y-6 px-4 sm:px-6 lg:col-span-9 lg:px-8">

        <div className="shadow sm:overflow-hidden sm:rounded-md bg-white py-6 px-4 mb-6 sm:p-6">
          <div className="  sm:mx-auto sm:max-w-md ">
            <div className=" sm:mx-auto sm:max-w-md ">
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <a href="#" className="font-medium text-sky-600 hover:text-sky-500">
                  ask Lab. manager
                </a>
                {' '}to create a new account.
              </p>
            </div>
            <form onSubmit={handleSubmit(onValid, onInvalid)} className="mt-8 space-y-6" action="#" method="POST">
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required.",
                      maxLength: {
                        message: "The Email must be less than 255 chars.",
                        value: 255,
                      },
                    })}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              {/* <div className="flex items-center justify-center">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-sky-600 hover:text-sky-500">
                      Any problems signing in?
                    </a>
                  </div>
                </div> */}

              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon className="h-5 w-5 text-sky-500 group-hover:text-sky-400" aria-hidden="true" />
                  </span>
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>


    </main >
  )
}