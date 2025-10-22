import http from "@/lib/http";
import {
  AccountResType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const PREFIX = "/accounts";
const accountApiRequests = {
  me: () => http.get<AccountResType>(`${PREFIX}/me`),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>(`${PREFIX}/me`, body),
};
export default accountApiRequests;
