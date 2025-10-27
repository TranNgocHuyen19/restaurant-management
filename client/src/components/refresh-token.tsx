"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Những page sau sẽ không check refresh token
const UNAUTHENTICATED_PATHS = ["/login", "/logout", "/refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return;
    let interval: any = null;
    //Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian timeout
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
      },
    });
    // Timeout interval phải nhỏ hơn thời gian còn lại của access token
    // Ví dụ thời gian hết hạn access token là 10s thì 1s sẽ check 1 lần
    const TIME_OUT = 1000;
    interval = setInterval(checkAndRefreshToken, TIME_OUT);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pathname]);
  return null;
}
