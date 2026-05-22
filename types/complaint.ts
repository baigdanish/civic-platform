export type ComplaintStatus = "Pending" | "In Progress" | "Resolved" | string;

export type Complaint = {
  _id: string;
  title: string;
  description: string;
  category: string;
  area?: string;
  image?: string | null;
  latitude?: number;
  longitude?: number;
  status: ComplaintStatus;
  upvotes: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateComplaintInput = {
  title: string;
  description: string;
  category: string;
  area?: string;
  latitude?: number;
  longitude?: number;
};

export type ComplaintListResponse = {
  success: boolean;
  count: number;
  data: Complaint[];
};

export type ComplaintDetailResponse = {
  success: boolean;
  data: Complaint;
};
