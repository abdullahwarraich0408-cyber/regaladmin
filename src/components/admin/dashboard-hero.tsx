import type { Booking } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatToday() {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

interface DashboardHeroProps {
  bookings: Booking[];
}

export function DashboardHero({ bookings }: DashboardHeroProps) {
  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const newCount = bookings.filter((b) => b.status === "new").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12121a] via-[#1c1b26] to-[#2d2418] p-8 shadow-xl shadow-zinc-900/10 ring-1 ring-white/10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300/80">
            Regal Knot Events Studio
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {greeting}
          </h1>
          <p className="text-sm text-zinc-400">{formatToday()}</p>
          <p className="text-base leading-relaxed text-zinc-300">
            {newCount > 0 ? (
              <>
                You have{" "}
                <span className="font-semibold text-amber-200">
                  {newCount} new {newCount === 1 ? "request" : "requests"}
                </span>{" "}
                waiting for review.
              </>
            ) : (
              <>All caught up — no new requests at the moment.</>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
            <p className="text-xs text-zinc-400">Total bookings</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {bookings.length}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 backdrop-blur-sm">
            <p className="text-xs text-emerald-200/70">{STATUS_LABELS.confirmed}</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-100">
              {confirmedCount}
            </p>
          </div>
          <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-5 py-4 backdrop-blur-sm">
            <p className="text-xs text-sky-200/70">{STATUS_LABELS.new}</p>
            <p className="mt-1 text-2xl font-semibold text-sky-100">{newCount}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
