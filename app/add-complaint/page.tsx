"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import LocationPicker from "./LocationPicker";
import Navbar from "../../components/Navbar";

const API_BASE_URL = "http://localhost:5000/api";

type ComplaintFormState = {
  title: string;
  area: string;
  category: string;
  description: string;
  image: File | null;
  latitude: number;
  longitude: number;
};

const INITIAL_FORM: ComplaintFormState = {
  title: "",
  area: "",
  category: "",
  description: "",
  image: null,
  latitude: 0,
  longitude: 0,
};

export default function AddComplaintPage() {
  const [formData, setFormData] = useState<ComplaintFormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const target = event.currentTarget;
    const { name, value } = target;

    if (target instanceof HTMLInputElement && target.type === "file") {
      setFormData((current) => ({
        ...current,
        [name]: target.files?.[0] || null,
      }));
      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("area", formData.area);
      payload.append("category", formData.category);
      payload.append("description", formData.description);
      payload.append("latitude", String(formData.latitude));
      payload.append("longitude", String(formData.longitude));

      if (formData.image) {
        payload.append("image", formData.image);
      }

      const response = await fetch(`${API_BASE_URL}/complaints`, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        throw new Error("Could not submit the complaint. Please try again.");
      }

      setFormData(INITIAL_FORM);
      setSuccessMessage(
        "Complaint submitted successfully. It should now appear on the dashboard.",
      );
    } catch (submitError) {
      setErrorMessage(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while submitting.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#edf6ff_100%)]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-4xl border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800">
              New Complaint
            </p>
            <h1 className="font-serif text-4xl leading-tight text-slate-900">
              Report an issue in a few quick steps.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Add clear location and category details so the issue can be
              reviewed and prioritized easily.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label="Your Name"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter your name"
              />
              <FormField
                label="Area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Ex: Downtown"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ex: Road Damage"
              />

              <LocationPicker
                onLocationChange={(lat, lng) => {
                  setFormData((current) => ({
                    ...current,
                    latitude: lat,
                    longitude: lng,
                  }));
                }}
              />
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Image Upload
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Describe the issue clearly so officials and neighbors understand the problem."
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white"
                required
              />
            </label>

            {successMessage ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
              <p className="text-sm text-slate-500">
                Image upload is sent using `FormData` to match your backend API.
              </p>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  name: "title" | "area" | "category";
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
};

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
}: FormFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white"
        required
      />
    </label>
  );
}
