import type { ReactNode } from "react";

import type { Booking, BookingStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

interface StatsCardsProps {
  bookings: Booking[];
}

const cards: {
  key: BookingStatus | "total";
  label: string;
  icon: ReactNode;
  gradient: string;
  iconBg: string;
}[] = [
  {
    key: "total",
    label: "Total bookings",
    gradient: "from-amber-500/10 to-orange-500/5",
    iconBg: "bg-amber-500/15 text-amber-700",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path
          d="M4 7h16M4 12h16M4 17h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "new",
    label: STATUS_LABELS.new,
    gradient: "from-sky-500/10 to-blue-500/5",
    iconBg: "bg-sky-500/15 text-sky-700",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path
          d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "contacted",
    label: STATUS_LABELS.contacted,
    gradient: "from-violet-500/10 to-purple-500/5",
    iconBg: "bg-violet-500/15 text-violet-700",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path
          d="M8 10h8M8 14h5M6 20l2.5-2H18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "confirmed",
    label: STATUS_LABELS.confirmed,
    gradient: "from-emerald-500/10 to-green-500/5",
    iconBg: "bg-emerald-500/15 text-emerald-700",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path
          d="m5 13 4 4L19 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function StatsCards({ bookings }: StatsCardsProps) {
  const counts = bookings.reduce<Record<string, number>>((acc, booking) => {
    acc[booking.status] = (acc[booking.status] ?? 0) + 1;
    return acc;
  }, {});

  const total = bookings.length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const value =
          card.key === "total" ? total : (counts[card.key] ?? 0);
        const share =
          card.key === "total" || total === 0
            ? null
            : Math.round((value / total) * 100);

        return (
          <div
            key={card.key}
            className={`group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-br ${card.gradient} p-5 shadow-sm transition hover:shadow-md`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-zinc-500">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
                  {value}
                </p>
                {share !== null ? (
                  <p className="mt-2 text-xs text-zinc-500">
                    {share}% of all bookings
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-zinc-500">All time</p>
                )}
              </div>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                {card.icon}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
