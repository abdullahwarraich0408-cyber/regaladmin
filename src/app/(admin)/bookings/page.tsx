import { BookingsTable } from "@/components/admin/bookings-table";
import { getBookings } from "@/lib/api";
import type { Booking } from "@/lib/types";

export default async function BookingsPage() {
  let bookings: Booking[] = [];
  let error: string | null = null;

  try {
    bookings = await getBookings();
  } catch {
    error =
      "Could not reach the backend API. Start it with `npm run dev` in the backend folder.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">All bookings</h3>
        <p className="text-sm text-zinc-500">
          Review requests and update their status as you progress each enquiry.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <BookingsTable bookings={bookings} />
      )}
    </div>
  );
}
