import {
  createComplaintApi,
  getComplaintApi,
  getComplaintsApi,
  upvoteComplaintApi,
} from "@/features/complaints/api/complaints.api";
import type { Complaint, CreateComplaintInput } from "@/types/complaint";

type ComplaintFilters = {
  category?: string;
  area?: string;
};

export async function getComplaints(filters: ComplaintFilters = {}) {
  const response = await getComplaintsApi(filters);
  return response.data;
}

export async function getComplaint(id: string) {
  const response = await getComplaintApi(id);
  return response.data;
}

export async function createComplaint(input: CreateComplaintInput) {
  const response = await createComplaintApi(input);
  return response.data;
}

export async function upvoteComplaint(id: string) {
  const response = await upvoteComplaintApi(id);
  return response.data;
}

export function filterComplaints(
  complaints: Complaint[],
  filters: ComplaintFilters
) {
  return complaints.filter((complaint) => {
    const areaMatches = filters.area
      ? complaint.area?.toLowerCase() === filters.area.toLowerCase()
      : true;
    const categoryMatches = filters.category
      ? complaint.category.toLowerCase() === filters.category.toLowerCase()
      : true;

    return areaMatches && categoryMatches;
  });
}
