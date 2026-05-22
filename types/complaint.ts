export type ComplaintStatus = "Pending" | "In Progress" | "Resolved" | string;

export type Complaint = {
  _id: string;
  id?: string;
  name?: string;
  title: string;
  description: string;
  category: string;
  categoryNormalized?: string;
  area?: string;
  areaNormalized?: string;
  image?: string | null;
  imageUrl?: string;
  photo?: string;
  latitude?: number;
  longitude?: number;
  status: ComplaintStatus;
  upvotes: number;
  upvoteCount?: number;
  ward?: string;
  wardNumber?: string;
  wardEmail?: string;
  escalationEmailSentAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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
