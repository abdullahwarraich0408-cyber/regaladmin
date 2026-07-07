"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateBookingStatus } from "@/lib/api";
import type { BookingStatus } from "@/lib/types";
import { BOOKING_STATUSES, STATUS_LABELS } from "@/lib/types";

interface StatusSelectProps {
  bookingId: string;
  value: BookingStatus;
}

export function StatusSelect({ bookingId, value }: StatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState(value);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onChange = (nextStatus: BookingStatus) => {
    setStatus(nextStatus);
    setError(null);

    startTransition(async () => {
      try {
        await updateBookingStatus(bookingId, nextStatus);
        router.refresh();
      } catch {
        setStatus(value);
        setError("Update failed");
      }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <select
        value={status}
        disabled={isPending}
        onChange={(event) => onChange(event.target.value as BookingStatus)}
        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none transition focus:border-amber-400 disabled:opacity-60"
      >
        {BOOKING_STATUSES.map((item) => (
          <option key={item} value={item}>
            {STATUS_LABELS[item]}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </div>
  );
}
