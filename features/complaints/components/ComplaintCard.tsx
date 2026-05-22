"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import type { Complaint } from "@/types/complaint";

type ComplaintCardProps = {
  complaint: Complaint;
  onUpvote: (id: string) => Promise<unknown>;
};

export function ComplaintCard({ complaint, onUpvote }: ComplaintCardProps) {
  const router = useRouter();
  const complaintId = complaint._id || complaint.id || "";
  const upvotes = complaint.upvotes ?? complaint.upvoteCount ?? 0;

  function openDetails() {
    if (complaintId) {
      router.push(`/complaint/${complaintId}`);
    }
  }

  function handleUpvote(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (complaintId) {
      void onUpvote(complaintId);
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetails();
        }
      }}
      className="cursor-pointer rounded-[1.5rem] border border-white/80 bg-white/90 p-5 shadow-[0_16px_48px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_64px_rgba(15,23,42,0.12)] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
        {complaint.category}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900">
        {complaint.title}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {complaint.area || "Area not specified"}
      </p>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
        {complaint.description}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
          {upvotes} upvotes
        </span>
        <button
          type="button"
          onClick={handleUpvote}
          disabled={!complaintId}
          className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Upvote
        </button>
      </div>
    </article>
  );
}
