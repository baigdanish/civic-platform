import { http } from "@/services/http";
import type {
  CreateComplaintInput,
  ComplaintDetailResponse,
  ComplaintListResponse,
} from "@/types/complaint";

export async function createComplaintApi(payload: CreateComplaintInput) {
  const response = await http.post<ComplaintDetailResponse>(
    "/complaints",
    payload,
  );
  return response.data;
}

type GetComplaintsParams = {
  category?: string;
  area?: string;
};

export async function getComplaintsApi(params: GetComplaintsParams = {}) {
  const response = await http.get<ComplaintListResponse>("/complaints", {
    params,
  });

  return response.data;
}

export async function upvoteComplaintApi(id: string) {
  const response = await http.put<ComplaintDetailResponse>(
    `/complaints/${id}/upvote`,
  );

  return response.data;
}
