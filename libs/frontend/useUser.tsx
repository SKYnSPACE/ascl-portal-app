import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface UserResponse {
  ok: boolean;
  user: User;
}
// const fetcher = (url: string) => fetch(url).then((response) => response.json());

export default function useUser() {
  const { data, error, isLoading } = useSWR<UserResponse>(
    typeof window === "undefined" ? null : "/api/users/me"
  );
  const router = useRouter();

  // Check the Login status from middleware!
  // useEffect(() => {
  //   console.log(data, error, isLoading, router);
  //   if (data && !data.ok) {
  //     router.replace("/enter");
  //     // setTimeout(() => {
  //     //   router.replace('/enter');
  //     // }, 5000);
  //   }
  // }, [data, router]);

  return { user: data?.user, isLoading: !data && !error };
}





// import { useRouter } from "next/router";
// import { useEffect } from "react";
// import useSWR from "swr";

// export default function useUser() {
//   const { data, error } = useSWR("/api/users/me");
//   const router = useRouter();
//   useEffect(() => {
//     if (data && !data.ok) {
//       router.replace("/enter");
//     }
//   }, [data, router]);
//   return { user: data?.profile, isLoading: !data && !error };
// }



// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";

// export default function useUser() {
//   const [user, setUser] = useState();
//   const router = useRouter();
//   useEffect(() => {
//     fetch("/api/users/me")
//       .then((response) => response.json())
//       .then((data) => {
//         if (!data.ok) {
//           return router.replace("/enter");
//         }
//         setUser(data.profile);
//       });
//   }, [user, router]);
//   return {user};
// }