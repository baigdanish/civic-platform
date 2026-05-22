"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createComplaint,
  filterComplaints,
  getComplaints,
  upvoteComplaint,
} from "@/features/complaints/services/complaints.service";
import { useDebounce } from "@/hooks/useDebounce";
import type { Complaint, CreateComplaintInput } from "@/types/complaint";

type UseComplaintsFilters = {
  category?: string;
  area?: string;
};

export function useComplaints(initialFilters: UseComplaintsFilters = {}) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filters, setFilters] = useState<UseComplaintsFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const debouncedFilters = useDebounce(filters);

  useEffect(() => {
    async function loadComplaints() {
      setLoading(true);
      setError("");

      try {
        const data = await getComplaints();
        setComplaints(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load complaints."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    return filterComplaints(complaints, debouncedFilters);
  }, [complaints, debouncedFilters]);

  const areaOptions = useMemo(() => {
    return Array.from(
      new Set(
        complaints.map((complaint) => complaint.area).filter(Boolean) as string[]
      )
    ).sort();
  }, [complaints]);

  const categoryOptions = useMemo(() => {
    return Array.from(
      new Set(complaints.map((complaint) => complaint.category))
    ).sort();
  }, [complaints]);

  async function addComplaint(payload: CreateComplaintInput) {
    const createdComplaint = await createComplaint(payload);
    setComplaints((current) => [createdComplaint, ...current]);
    return createdComplaint;
  }

  async function handleUpvote(id: string) {
    const updatedComplaint = await upvoteComplaint(id);
    setComplaints((current) =>
      current.map((complaint) =>
        complaint._id === id ? updatedComplaint : complaint
      )
    );
    return updatedComplaint;
  }

  return {
    complaints: filteredComplaints,
    allComplaints: complaints,
    areaOptions,
    categoryOptions,
    filters,
    setFilters,
    loading,
    error,
    addComplaint,
    upvoteComplaint: handleUpvote,
  };
}
