"use client";

import dynamic from "next/dynamic";

type LocationPickerProps = {
  onLocationChange: (lat: number, lng: number) => void;
};

const ClientLocationMap = dynamic(() => import("./LocationPickerMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
      Loading map...
    </div>
  ),
});

export default function LocationPicker({
  onLocationChange,
}: LocationPickerProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
      Location
      <ClientLocationMap onLocationChange={onLocationChange} />
    </label>
  );
}
