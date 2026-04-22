import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
            CR
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Civic Platform
            </p>
            <p className="text-lg font-semibold text-slate-900">Civic Report</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Complaints
          </Link>
          <Link
            href="/add-complaint"
            className="inline-flex h-10 items-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Add Complaint
          </Link>
        </nav>
      </div>
    </header>
  );
}
