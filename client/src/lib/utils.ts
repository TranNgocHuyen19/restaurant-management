import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
import { on } from "events";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((err) => {
      setError(err.field, {
        type: "server",
        message: err.message,
      });
    });
  } else {
    toast.error("Lỗi", {
      description: error.payload.message ?? "Lỗi không xác định",
      duration: duration ?? 5000,
    });
  }
};

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};

export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("refreshToken") : null;
};

export const setAccessTokenToLocalStorage = (value: string) => {
  return isBrowser && localStorage.setItem("accessToken", value);
};

export const setRefreshTokenToLocalStorage = (value: string) => {
  return isBrowser && localStorage.setItem("refreshToken", value);
};

export const removeTokensFromLocalStorage = () => {
  if (!isBrowser) return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  // Không nên đưa logic lấy access và refresh ra khỏi func này
  // vì để mỗi lần mà checkAndRefreshToken được gọi thì nó sẽ lấy giá trị mới nhất từ localStorage
  // tránh lấy token cũ ở lần đầu rồi gọi cho các lần sau
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  //Chưa đăng nhập thì cũng không cho chạy
  if (!accessToken || !refreshToken) return;

  const decodeAccessToken = jwt.decode(accessToken) as {
    exp: number;
    iat: number;
  };
  const decodeRefreshToken = jwt.decode(refreshToken) as {
    exp: number;
    iat: number;
  };
  // Thời điểm hết hạn của token là tính theo epoch time (giây từ 1970)
  // Còn khi dùng cú pháp new Date().getTime() thì sẽ trả về epoch time
  const currentTime = new Date().getTime() / 1000 - 1; // in seconds
  // trường hợp refresh token hết hạn thì không xử lý
  if (decodeRefreshToken.exp <= currentTime) {
    removeTokensFromLocalStorage();
    return param?.onError && param.onError();
  }
  //Ví dụ access token có thời gian hết hạn là 10s
  // thì sẽ kiếm trả còn 1/3 thời gian thì sẽ cho refresh token lại
  // thời gian còn lại sẽ tính dựa trên công thức decodeAccessToken.exp - currentTime
  // thời gian hết hạn của access token: decodeAccessToken.exp - iat
  if (
    decodeAccessToken.exp - currentTime <
    (decodeAccessToken.exp - decodeAccessToken.iat) / 3
  ) {
    try {
      const res = await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      param?.onSuccess && param.onSuccess();
    } catch (error) {
      param?.onError && param.onError();
    }
  }
};
