"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { ComplaintsView } from "@/features/complaints/components/ComplaintsView";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(29,78,216,0.12),_transparent_38%),linear-gradient(180deg,_#f8fbff_0%,_#eef4f7_100%)]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow="Civic Complaint Dashboard"
              title="Surface local issues clearly and help communities respond faster."
              description="Browse citizen reports, filter by neighborhood or issue type, and upvote the complaints that need attention most urgently."
            />
          </div>
        </section>

        <ComplaintsView />
      </main>
    </div>
  );
}
