import { http } from "@/services/http";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  CreateComplaintInput,
  ComplaintDetailResponse,
  ComplaintListResponse,
} from "@/types/complaint";

export async function createComplaintApi(payload: CreateComplaintInput) {
  const response = await http.post<ComplaintDetailResponse>(
    ENDPOINTS.complaints,
    payload,
  );
  return response.data;
}

type GetComplaintsParams = {
  category?: string;
  area?: string;
};

export async function getComplaintsApi(params: GetComplaintsParams = {}) {
  const response = await http.get<ComplaintListResponse>(ENDPOINTS.complaints, {
    params,
  });

  return response.data;
}

export async function getComplaintApi(id: string) {
  const response = await http.get<ComplaintDetailResponse>(
    ENDPOINTS.complaintDetail(id),
  );

  return response.data;
}

export async function upvoteComplaintApi(id: string) {
  const response = await http.put<ComplaintDetailResponse>(
    ENDPOINTS.complaintUpvote(id),
  );

  return response.data;
}
