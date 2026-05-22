"use client";

import { ComplaintCard } from "@/features/complaints/components/ComplaintCard";
import { ComplaintsFilters } from "@/features/complaints/components/ComplaintsFilters";
import { useComplaints } from "@/features/complaints/hooks/useComplaints";

export function ComplaintsView() {
  const {
    complaints,
    areaOptions,
    categoryOptions,
    filters,
    setFilters,
    loading,
    error,
    upvoteComplaint,
  } = useComplaints();

  return (
    <section className="flex flex-col gap-8">
      <ComplaintsFilters
        area={filters.area || ""}
        category={filters.category || ""}
        areaOptions={areaOptions}
        categoryOptions={categoryOptions}
        onAreaChange={(value) =>
          setFilters((current) => ({ ...current, area: value }))
        }
        onCategoryChange={(value) =>
          setFilters((current) => ({ ...current, category: value }))
        }
      />

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
              className="h-[280px] animate-pulse rounded-[1.5rem] border border-slate-200 bg-white/80"
            />
          ))}
        </div>
      ) : complaints.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint._id}
              complaint={complaint}
              onUpvote={upvoteComplaint}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            No complaints found
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            Try changing the filters or create a new complaint.
          </p>
        </div>
      )}
    </section>
  );
}
