import http from "@/lib/http";
import {
  AccountResType,
  ChangePasswordBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const PREFIX = "/accounts";
const accountApiRequests = {
  me: () => http.get<AccountResType>(`${PREFIX}/me`),

  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>(`${PREFIX}/me`, body),

  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>(`${PREFIX}/change-password`, body),
};
export default accountApiRequests;
