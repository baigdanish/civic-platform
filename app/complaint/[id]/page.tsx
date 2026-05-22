"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  getComplaint,
  upvoteComplaint,
} from "@/features/complaints/services/complaints.service";
import type { Complaint } from "@/types/complaint";

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
        const data = await getComplaint(id);
        setComplaint(data);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to fetch complaint details.",
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

    const complaintId = complaint._id || complaint.id;

    if (!complaintId) {
      return;
    }

    setUpdating(true);
    setError("");

    try {
      const updatedComplaint = await upvoteComplaint(complaintId);
      setComplaint(updatedComplaint);
    } catch (upvoteError) {
      setError(
        upvoteError instanceof Error ? upvoteError.message : "Upvote failed.",
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#edf2f7_100%)]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <ComplaintDetailSkeleton />
        ) : error && !complaint ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : complaint ? (
          <ComplaintDetail
            complaint={complaint}
            error={error}
            onUpvote={handleUpvote}
            updating={updating}
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600">
            Complaint not found.
          </div>
        )}
      </main>
    </div>
  );
}

function ComplaintDetail({
  complaint,
  error,
  onUpvote,
  updating,
}: {
  complaint: Complaint;
  error: string;
  onUpvote: () => void;
  updating: boolean;
}) {
  const imageUrl = getImageUrl(complaint);
  const upvotes = complaint.upvotes ?? complaint.upvoteCount ?? 0;
  const hasLocation =
    typeof complaint.latitude === "number" &&
    typeof complaint.longitude === "number";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="bg-slate-100">
          <img
            src={imageUrl}
            alt={complaint.title || complaint.category || "Complaint image"}
            className="h-[320px] w-full object-cover sm:h-[460px]"
          />
        </div>

        <div className="grid gap-5 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-10 items-center rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
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
              {complaint.title || "Untitled complaint"}
            </h1>
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              {complaint.area || "Area not specified"}
            </p>
            <p className="mt-5 text-base leading-7 text-slate-600">
              {complaint.description || "No description provided."}
            </p>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </div>
      </section>

      <aside className="grid content-start gap-6">
        <section className="rounded-[2rem] border border-white/70 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Upvotes
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {upvotes}
              </p>
            </div>
            <button
              type="button"
              onClick={onUpvote}
              disabled={updating}
              className="inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {updating ? "Updating..." : "Upvote"}
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_18px_56px_rgba(15,23,42,0.08)]">
          <div className="p-5">
            <h2 className="text-lg font-semibold text-slate-900">Location</h2>
            <p className="mt-1 text-sm text-slate-500">
              {hasLocation
                ? `${complaint.latitude?.toFixed(6)}, ${complaint.longitude?.toFixed(6)}`
                : "Coordinates not available"}
            </p>
          </div>
          {hasLocation ? (
            <MapPreview
              latitude={complaint.latitude as number}
              longitude={complaint.longitude as number}
            />
          ) : (
            <div className="flex h-72 items-center justify-center border-t border-slate-100 bg-slate-50 text-sm text-slate-500">
              No map location was submitted.
            </div>
          )}
        </section>

        <section className="grid gap-3 rounded-[2rem] border border-white/70 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.08)]">
          <InfoBlock label="Ward" value={complaint.wardNumber || "Not assigned"} />
          <InfoBlock label="Ward Email" value={complaint.wardEmail || "Not available"} />
          <InfoBlock label="Reported" value={formatDate(complaint.createdAt)} />
          <InfoBlock label="Last Updated" value={formatDate(complaint.updatedAt)} />
        </section>
      </aside>
    </div>
  );
}

function MapPreview({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const mapUrl = useMemo(() => {
    const delta = 0.01;
    const bbox = [
      longitude - delta,
      latitude - delta,
      longitude + delta,
      latitude + delta,
    ].join(",");

    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
  }, [latitude, longitude]);

  return (
    <iframe
      title="Complaint location map"
      src={mapUrl}
      className="h-72 w-full border-0"
      loading="lazy"
    />
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-slate-900">
        {value}
      </p>
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

function ComplaintDetailSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
      <div className="h-[680px] animate-pulse rounded-[2rem] border border-slate-200 bg-white/80" />
      <div className="grid content-start gap-6">
        <div className="h-28 animate-pulse rounded-[2rem] border border-slate-200 bg-white/80" />
        <div className="h-96 animate-pulse rounded-[2rem] border border-slate-200 bg-white/80" />
      </div>
    </div>
  );
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

function formatDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
