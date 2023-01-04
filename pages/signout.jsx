import { useEffect, useContext } from "react";
import useMutation from "../libs/frontend/useMutation"
import { classNames } from "../libs/frontend/utils"
import { useRouter } from "next/router";
import LocalDatabase from '../components/LocalDatabase';


export default function Enter() {

  const [logout, {loading: logoutLoading, data:logoutData, error: logoutError}] = useMutation("/api/users/logout");

  const localDatabase = useContext(LocalDatabase);

  const router = useRouter();

  useEffect(()=>{

    localDatabase.setUser({
      name: null,
      email: null,
      role: null,
      avatar: null,
    })

    logout();
    console.log('Logged out.');
    router.replace("/"); //router.push("/");
  },[logoutData, router])


  return (
    <></>
  )
}
