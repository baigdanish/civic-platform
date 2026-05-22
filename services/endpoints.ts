export const ENDPOINTS = {
  complaints: "/complaints",
  complaintDetail: (complaintId: string) =>
    `/complaints/${encodeURIComponent(complaintId)}`,
  complaintUpvote: (complaintId: string) =>
    `/complaints/${encodeURIComponent(complaintId)}/upvote`,
} as const;
