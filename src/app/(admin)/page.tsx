import Link from "next/link";

import { BookingPipeline } from "@/components/admin/booking-pipeline";
import { BookingsTable } from "@/components/admin/bookings-table";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { DashboardHero } from "@/components/admin/dashboard-hero";
import { QuickActions } from "@/components/admin/quick-actions";
import { StatsCards } from "@/components/admin/stats-cards";
import { getBookings } from "@/lib/api";
import type { Booking } from "@/lib/types";

export default async function DashboardPage() {
  let bookings: Booking[] = [];
  let error: string | null = null;

  try {
    bookings = await getBookings();
  } catch {
    error =
      "Could not reach the backend API. Start it with `npm run dev` in the backend folder.";
  }

  return (
    <div className="space-y-8">
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <>
          <DashboardHero bookings={bookings} />
          <StatsCards bookings={bookings} />
          <DashboardCharts bookings={bookings} />
          <BookingPipeline bookings={bookings} />
          <QuickActions />
        </>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl text-midnight">Recent bookings</h3>
            <p className="text-sm text-muted">Latest requests from the public website</p>
          </div>
          <Link href="/bookings" className="btn-primary">
            View all
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path
                d="M5 12h14m-6-6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <BookingsTable bookings={bookings.slice(0, 5)} showActions={false} />
      </section>
    </div>
  );
}
