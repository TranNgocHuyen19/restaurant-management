import http from "@/lib/http";

import {
  LoginBodyType,
  LoginResType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";
const authApiRequest = {
  sLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),

  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),

  logoutFromNextServerToServer: ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) =>
    http.post<MessageResType>(
      "/auth/logout",
      {
        refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),

  logout: () =>
    http.post<MessageResType>("/api/auth/logout", null, {
      baseUrl: "",
    }),

  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/auth/refresh-token", body),
  refreshToken: () =>
    http.post<RefreshTokenResType>("/api/auth/refresh-token", null, {
      baseUrl: "",
    }),
};

export default authApiRequest;
