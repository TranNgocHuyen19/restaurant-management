import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

const PREFIX = "/accounts";
const accountApiRequests = {
  me: () => http.get<AccountResType>(`${PREFIX}/me`),
};
export default accountApiRequests;
