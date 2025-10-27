import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import {
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { set } from "zod";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json(
      {
        message: "Không tìm thấy refresh token",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const { payload } = await authApiRequest.sRefreshToken({ refreshToken });
    const decodedAccessToken = jwt.decode(payload.data.accessToken) as {
      exp: number;
    };
    const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as {
      exp: number;
    };
    cookieStore.set({
      name: "accessToken",
      value: payload.data.accessToken,
      sameSite: "lax",
      httpOnly: true,
      secure: true,
      path: "/",
      expires: decodedAccessToken.exp * 1000,
    });
    cookieStore.set({
      name: "refreshToken",
      value: payload.data.refreshToken,
      sameSite: "lax",
      httpOnly: true,
      secure: true,
      path: "/",
      expires: decodedRefreshToken.exp * 1000,
    });
    return Response.json(payload);
  } catch (error: any) {
    return Response.json(
      {
        message: error.message ?? "Có lỗi xảy ra",
      },
      {
        status: 401,
      }
    );
  }
}
