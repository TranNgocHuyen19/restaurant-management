import http from "@/lib/http";
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const PREFIX = "/accounts";
const accountApiRequests = {
  me: () => http.get<AccountResType>(`${PREFIX}/me`),

  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>(`${PREFIX}/me`, body),

  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>(`${PREFIX}/change-password`, body),

  list: () => http.get<AccountListResType>(`${PREFIX}`),

  addEmployee: (body: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType>(`${PREFIX}`, body),

  updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) =>
    http.put<AccountResType>(`${PREFIX}/detail/${id}`, body),

  getEmployee: (id: number) =>
    http.get<AccountResType>(`${PREFIX}/detail/${id}`),

  deleteById: (id: number) =>
    http.delete<AccountResType>(`${PREFIX}/detail/${id}`),
};
export default accountApiRequests;
