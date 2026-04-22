"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { type Complaint } from "../../../components/ComplaintCard";

const API_BASE_URL = "http://localhost:5000/api";

type ComplaintDetailResponse = Complaint | { complaint?: Complaint };
type ComplaintDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function ComplaintDetailPage({
  params,
}: ComplaintDetailPageProps) {
  const { id } = use(params);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadComplaint() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Complaint details could not be loaded.");
        }

        const data: ComplaintDetailResponse = await response.json();
        setComplaint(
          data && typeof data === "object" && "complaint" in data
            ? (data as { complaint?: Complaint }).complaint || null
            : (data as Complaint)
        );
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to fetch complaint details."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadComplaint();
  }, [id]);

  async function handleUpvote() {
    if (!complaint) {
      return;
    }

    setUpdating(true);
    setError("");

    try {
      const complaintId = complaint._id || complaint.id;
      const response = await fetch(
        `${API_BASE_URL}/complaints/upvote/${complaintId}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to upvote this complaint.");
      }

      setComplaint((current) =>
        current
          ? {
              ...current,
              upvotes: (current.upvotes ?? current.upvoteCount ?? 0) + 1,
            }
          : current
      );
    } catch (upvoteError) {
      setError(upvoteError instanceof Error ? upvoteError.message : "Upvote failed.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fbff_0%,_#edf2f7_100%)]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="h-[520px] animate-pulse rounded-[2rem] border border-slate-200 bg-white/80" />
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : complaint ? (
          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="bg-slate-100">
                <img
                  src={getImageUrl(complaint)}
                  alt={complaint.category || "Complaint image"}
                  className="h-full min-h-[280px] w-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-6 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Back to complaints
                  </Link>
                  <StatusBadge status={complaint.status} />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
                    {complaint.category || "General Issue"}
                  </p>
                  <h1 className="mt-3 font-serif text-4xl leading-tight text-slate-900">
                    {complaint.area || "Unknown Area"}
                  </h1>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    {complaint.description || "No description provided."}
                  </p>
                </div>

                <div className="grid gap-4 rounded-[1.5rem] bg-slate-50 p-5 sm:grid-cols-2">
                  <InfoBlock
                    label="Reported By"
                    value={complaint.name || "Anonymous"}
                  />
                  <InfoBlock
                    label="Upvotes"
                    value={String(complaint.upvotes ?? complaint.upvoteCount ?? 0)}
                  />
                  <InfoBlock
                    label="Area"
                    value={complaint.area || "Not specified"}
                  />
                  <InfoBlock
                    label="Current Status"
                    value={complaint.status || "Pending"}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleUpvote}
                  disabled={updating}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {updating ? "Updating..." : "Upvote This Complaint"}
                </button>
              </div>
            </div>
          </section>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600">
            Complaint not found.
          </div>
        )}
      </main>
    </div>
  );
}

type InfoBlockProps = {
  label: string;
  value: string;
};

function InfoBlock({ label, value }: InfoBlockProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const normalizedStatus = (status || "Pending").toLowerCase();
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    "in progress": "bg-sky-100 text-sky-800",
    resolved: "bg-emerald-100 text-emerald-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[normalizedStatus] || "bg-slate-100 text-slate-700"}`}
    >
      {status || "Pending"}
    </span>
  );
}

function getImageUrl(complaint: Complaint) {
  const imagePath = complaint.image || complaint.imageUrl || complaint.photo;

  if (!imagePath) {
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return imagePath.startsWith("/")
    ? `http://localhost:5000${imagePath}`
    : `http://localhost:5000/${imagePath}`;
}
