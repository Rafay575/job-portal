"use client";

import { useEffect } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import axios from "axios";
import toast from "react-hot-toast";

import { logoutUser } from "@/lib/auth";
import { RootState } from "@/lib/store";
import { clearUser } from "@/lib/userSlice";

export default function AuthChecker() {
  const pathname = usePathname();

  const router = useRouter();

  const dispatch = useDispatch();

  const user = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    

    if (!user) {
      console.log("No user found in redux");
      return;
    }

    if (!user?.id) {
      console.log("User ID missing in redux");
      return;
    }

    // =========================
    // ✅ Check user in DB
    // =========================
    const checkUser = async () => {
      try {
        
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/check-user`,
          {
            userId: user.id,
          }
        );

        if (!res) {
          console.log(
            "No response from server"
          );

          return;
        }

        const data = res.data;

        if (!data) {
          console.log("No data returned");

          return;
        }


        if (!data.exists) {
          console.log("User not found");
          toast.error("User not found");
          dispatch(clearUser());
          await logoutUser();
          router.replace("/auth/login");

          return;
        }
        console.log("User verified");
      } catch (error: any) {

        console.error(
          "Auth check failed:",
          error
        );

        // Server error
        if (error?.response?.status === 500) {
          toast.error(
            "Server error while verifying user"
          );
        }

        // Unauthorized
        else if (
          error?.response?.status === 401
        ) {
          toast.error(
            "Session expired"
          );

          dispatch(clearUser());

          await logoutUser();

          router.replace("/auth/login");
        }

        // Network error
        else if (error?.code === "ERR_NETWORK") {
          toast.error(
            "Network error"
          );
        }

        // Generic error
        else {
          toast.error(
            "Something went wrong"
          );
        }
      }
    };

    checkUser();
  }, [user?.id, pathname]);

  return null;
}