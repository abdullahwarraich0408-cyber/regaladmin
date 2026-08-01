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
      <div className="admin-card border-dashed p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-warm-beige text-muted">
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
        <p className="mt-4 font-display text-2xl text-midnight">No bookings yet</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Full Plan My Event requests from the website will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-left text-sm">
          <thead className="bg-warm-beige/50 text-xs uppercase tracking-wide text-muted">
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
          <tbody className="divide-y divide-border/70">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="align-top transition hover:bg-warm-beige/30"
              >
                <td className="px-4 py-4">
                  <div className="font-medium text-midnight">{booking.fullName}</div>
                  <div className="mt-1 text-muted">
                    {booking.email || booking.phone || "No contact details"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-midnight">{booking.eventType}</div>
                  {booking.budgetRange ? (
                    <div className="mt-1 text-muted">{booking.budgetRange}</div>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-foreground">{booking.preferredDate}</td>
                <td className="px-4 py-4 text-foreground">{booking.eventLocation}</td>
                <td className="px-4 py-4 text-muted">{formatDate(booking.createdAt)}</td>
                <td className="px-4 py-4">
                  <StatusBadge status={booking.status} />
                </td>
                {showActions ? (
                  <td className="px-4 py-4">
                    <StatusSelect bookingId={booking.id} value={booking.status} />
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
