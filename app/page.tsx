"use client";

import { useEffect, useMemo, useState } from "react";
import ComplaintCard, { type Complaint } from "../components/ComplaintCard";
import Navbar from "../components/Navbar";

const API_BASE_URL = "http://localhost:5000/api";

type ComplaintListResponse = Complaint[] | { complaints?: Complaint[] };

export default function HomePage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    void fetchComplaints();
  }, [selectedArea, selectedCategory]);

  async function fetchComplaints() {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (selectedArea) {
        params.set("area", selectedArea);
      }

      if (selectedCategory) {
        params.set("category", selectedCategory);
      }

      const query = params.toString();
      const response = await fetch(
        `${API_BASE_URL}/complaints${query ? `?${query}` : ""}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Unable to load complaints right now.");
      }

      const data: ComplaintListResponse = await response.json();
      setComplaints(Array.isArray(data) ? data : data.complaints || []);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Something went wrong while loading data."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleUpvote(id: string) {
    setUpdatingId(id);

    try {
      const response = await fetch(`${API_BASE_URL}/complaints/upvote/${id}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Upvote failed. Please try again.");
      }

      setComplaints((currentComplaints) =>
        currentComplaints.map((complaint) =>
          getComplaintId(complaint) === id
            ? {
                ...complaint,
                upvotes: getUpvoteCount(complaint) + 1,
              }
            : complaint
        )
      );
    } catch (upvoteError) {
      setError(
        upvoteError instanceof Error
          ? upvoteError.message
          : "Unable to upvote this complaint."
      );
    } finally {
      setUpdatingId("");
    }
  }

  const filterOptions = useMemo(() => {
    const areas = new Set<string>();
    const categories = new Set<string>();

    complaints.forEach((complaint) => {
      if (complaint.area) {
        areas.add(complaint.area);
      }

      if (complaint.category) {
        categories.add(complaint.category);
      }
    });

    return {
      areas: Array.from(areas).sort(),
      categories: Array.from(categories).sort(),
    };
  }, [complaints]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(29,78,216,0.12),_transparent_38%),linear-gradient(180deg,_#f8fbff_0%,_#eef4f7_100%)]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-800">
                Civic Complaint Dashboard
              </p>
              <h1 className="font-serif text-4xl leading-tight text-slate-900 sm:text-5xl">
                Surface local issues clearly and help communities respond faster.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Browse citizen reports, filter by neighborhood or issue type,
                and upvote the complaints that need attention most urgently.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex min-w-[180px] flex-col gap-2 text-sm font-medium text-slate-700">
                Area
                <select
                  value={selectedArea}
                  onChange={(event) => setSelectedArea(event.target.value)}
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
                >
                  <option value="">All areas</option>
                  {filterOptions.areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex min-w-[180px] flex-col gap-2 text-sm font-medium text-slate-700">
                Category
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
                >
                  <option value="">All categories</option>
                  {filterOptions.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[360px] animate-pulse rounded-[1.75rem] border border-slate-200 bg-white/80"
              />
            ))}
          </div>
        ) : complaints.length ? (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {complaints.map((complaint) => (
              <ComplaintCard
                key={getComplaintId(complaint)}
                complaint={complaint}
                onUpvote={handleUpvote}
                isUpdating={updatingId === getComplaintId(complaint)}
              />
            ))}
          </section>
        ) : (
          <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              No complaints found
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
              Try changing the filters or add a new complaint to start tracking
              issues in your area.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

function getComplaintId(complaint: Complaint) {
  return complaint._id || complaint.id || "";
}

function getUpvoteCount(complaint: Complaint) {
  return complaint.upvotes ?? complaint.upvoteCount ?? 0;
}
