"use client";

import { useAppContext } from "@/components/app-provider";
import { getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsAuth } = useAppContext();
  const refreshTokenFromURL = searchParams.get("refreshToken");
  const accessTokenFromURL = searchParams.get("accessToken");
  const ref = useRef<any>(null);

  useEffect(() => {
    if (
      !ref.current &&
      ((refreshTokenFromURL &&
        refreshTokenFromURL === getRefreshTokenFromLocalStorage()) ||
        (accessTokenFromURL &&
          accessTokenFromURL === localStorage.getItem("accessToken")))
    ) {
      ref.current = mutateAsync().then(() => {
        setTimeout(() => {
          ref.current = null;
        }, 1000);
        setIsAuth(false);
        router.push("/login");
      });
    } else {
      router.push("/");
    }
  }, [mutateAsync, router, accessTokenFromURL, refreshTokenFromURL, setIsAuth]);

  return <div>Logout...</div>;
}
