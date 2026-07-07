import type { Booking, BookingStatus } from "@/lib/types";
import { BOOKING_STATUSES, STATUS_LABELS } from "@/lib/types";

const pipelineColors: Record<BookingStatus, string> = {
  new: "bg-sky-500",
  contacted: "bg-violet-500",
  quoted: "bg-amber-500",
  confirmed: "bg-emerald-500",
  declined: "bg-rose-400",
};

interface BookingPipelineProps {
  bookings: Booking[];
}

export function BookingPipeline({ bookings }: BookingPipelineProps) {
  const counts = BOOKING_STATUSES.reduce<Record<BookingStatus, number>>(
    (acc, status) => {
      acc[status] = bookings.filter((b) => b.status === status).length;
      return acc;
    },
    { new: 0, contacted: 0, quoted: 0, confirmed: 0, declined: 0 },
  );

  const total = bookings.length;

  if (total === 0) {
    return (
      <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-zinc-900">Booking pipeline</h3>
        <p className="mt-2 text-sm text-zinc-500">
          Status breakdown will appear once bookings come in.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Booking pipeline</h3>
          <p className="mt-1 text-sm text-zinc-500">
            How requests are moving through your workflow
          </p>
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
          {total} total
        </span>
      </div>

      <div className="flex h-3 overflow-hidden rounded-full bg-zinc-100">
        {BOOKING_STATUSES.map((status) => {
          const count = counts[status];
          if (count === 0) return null;
          const width = (count / total) * 100;

          return (
            <div
              key={status}
              className={`${pipelineColors[status]} transition-all`}
              style={{ width: `${width}%` }}
              title={`${STATUS_LABELS[status]}: ${count}`}
            />
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
        {BOOKING_STATUSES.map((status) => {
          const count = counts[status];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={status} className="flex items-center gap-2 text-sm">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${pipelineColors[status]}`}
              />
              <span className="text-zinc-600">{STATUS_LABELS[status]}</span>
              <span className="font-medium text-zinc-900">{count}</span>
              <span className="text-zinc-400">({pct}%)</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
