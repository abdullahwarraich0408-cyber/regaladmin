import type { Booking, BookingStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

const statusStyles: Record<BookingStatus, string> = {
  new: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
  contacted: "bg-violet-500/10 text-violet-700 ring-violet-500/20",
  quoted: "bg-amber-500/10 text-amber-700 ring-amber-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  declined: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
