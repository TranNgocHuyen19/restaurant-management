import http from "@/lib/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";

const PREFIX = "/dishes";

const dishApiRequests = {
  list: () => http.get<DishListResType>(`${PREFIX}`),

  getDish: (id: number) => http.get<DishResType>(`${PREFIX}/${id}`),

  addDish: (body: CreateDishBodyType) =>
    http.post<DishResType>(`${PREFIX}`, body),

  updateDish: (id: number, body: UpdateDishBodyType) =>
    http.put<DishResType>(`${PREFIX}/${id}`, body),

  deleteDish: (id: number) => http.delete<DishResType>(`${PREFIX}/${id}`),
};
export default dishApiRequests;
