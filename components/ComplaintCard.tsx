"use client";

import Link from "next/link";

export type Complaint = {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  area?: string;
  category?: string;
  description?: string;
  status?: string;
  image?: string;
  imageUrl?: string;
  photo?: string;
  upvotes?: number;
  upvoteCount?: number;
};

type ComplaintCardProps = {
  complaint: Complaint;
  onUpvote: (id: string) => void;
  isUpdating?: boolean;
};

export default function ComplaintCard({
  complaint,
  onUpvote,
  isUpdating = false,
}: ComplaintCardProps) {
  const complaintId = complaint._id || complaint.id || "";
  const upvotes = complaint.upvotes ?? complaint.upvoteCount ?? 0;
  const status = complaint.status || "Pending";

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/90 shadow-[0_16px_48px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_64px_rgba(15,23,42,0.12)]">
      <div className="relative">
        <img
          src={getImageUrl(complaint)}
          alt={complaint.category || "Complaint image"}
          className="h-56 w-full object-cover"
        />
        <span
          className={`absolute left-4 top-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(status)}`}
        >
          {status}
        </span>
      </div>

      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              {complaint.category || "General"}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              {complaint.title || complaint.area || "Untitled complaint"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {complaint.area || "Area not specified"}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-3 py-2 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Upvotes
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">{upvotes}</p>
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
          {complaint.description || "No description provided for this complaint."}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onUpvote(complaintId)}
            disabled={isUpdating || !complaintId}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isUpdating ? "Updating..." : "Upvote"}
          </button>
          <Link
            href={`/complaint/${complaintId}`}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function getStatusClasses(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "resolved") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (normalizedStatus === "in progress") {
    return "bg-sky-100 text-sky-800";
  }

  return "bg-amber-100 text-amber-800";
}

function getImageUrl(complaint: Complaint) {
  const imagePath = complaint.image || complaint.imageUrl || complaint.photo;

  if (!imagePath) {
    return "https://images.unsplash.com/photo-1523428096881-5bd79d043006?auto=format&fit=crop&w=1200&q=80";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return imagePath.startsWith("/")
    ? `http://localhost:5000${imagePath}`
    : `http://localhost:5000/${imagePath}`;
}
