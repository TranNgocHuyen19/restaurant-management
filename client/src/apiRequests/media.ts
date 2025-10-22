import http from "@/lib/http";
import { UploadImageResType } from "@/schemaValidations/media.schema";

const PREFIX = "/media";

export const mediaApiRequests = {
  uploadMedia: (formData: FormData) =>
    http.post<UploadImageResType>(`${PREFIX}/upload`, formData),
};
