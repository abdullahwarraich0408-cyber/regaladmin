import type { Booking } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { StatusSelect } from "./status-select";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

interface BookingsTableProps {
  bookings: Booking[];
  showActions?: boolean;
}

export function BookingsTable({
  bookings,
  showActions = true,
}: BookingsTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300/80 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
            <path
              d="M8 7V3m8 4V3M4 11h16M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="mt-4 text-lg font-medium text-zinc-900">No bookings yet</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
          New event requests from the website will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-100 text-left text-sm">
          <thead className="bg-zinc-50/80 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Preferred date</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {showActions ? (
                <th className="px-4 py-3 font-medium">Update</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="align-top transition hover:bg-amber-50/30"
              >
                <td className="px-4 py-4">
                  <div className="font-medium text-zinc-900">
                    {booking.fullName}
                  </div>
                  <div className="mt-1 text-zinc-500">
                    {booking.email || booking.phone || "No contact details"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-zinc-900">
                    {booking.eventType}
                  </div>
                  {booking.budgetRange ? (
                    <div className="mt-1 text-zinc-500">
                      {booking.budgetRange}
                    </div>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-zinc-700">
                  {booking.preferredDate}
                </td>
                <td className="px-4 py-4 text-zinc-700">
                  {booking.eventLocation}
                </td>
                <td className="px-4 py-4 text-zinc-500">
                  {formatDate(booking.createdAt)}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={booking.status} />
                </td>
                {showActions ? (
                  <td className="px-4 py-4">
                    <StatusSelect
                      bookingId={booking.id}
                      value={booking.status}
                    />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
