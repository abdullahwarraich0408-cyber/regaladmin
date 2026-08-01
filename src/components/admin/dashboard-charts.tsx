import type { ReactNode } from "react";

import type { Booking, BookingStatus } from "@/lib/types";
import { BOOKING_STATUSES, STATUS_LABELS } from "@/lib/types";

const statusColors: Record<BookingStatus, string> = {
  new: "#0ea5e9",
  contacted: "#8b5cf6",
  quoted: "#f59e0b",
  confirmed: "#10b981",
  declined: "#fb7185",
};

const barColors = [
  "#f59e0b",
  "#8b5cf6",
  "#0ea5e9",
  "#10b981",
  "#fb7185",
  "#6366f1",
];

interface DashboardChartsProps {
  bookings: Booking[];
}

function getStatusCounts(bookings: Booking[]) {
  return BOOKING_STATUSES.reduce<Record<BookingStatus, number>>(
    (acc, status) => {
      acc[status] = bookings.filter((b) => b.status === status).length;
      return acc;
    },
    { new: 0, contacted: 0, quoted: 0, confirmed: 0, declined: 0 },
  );
}

function getEventTypeCounts(bookings: Booking[]) {
  const counts = bookings.reduce<Record<string, number>>((acc, booking) => {
    const label = booking.eventType.trim() || "Unspecified";
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);
}

function getMonthlyCounts(bookings: Booking[]) {
  const now = new Date();
  const months: { label: string; key: string; count: number }[] = [];

  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(date);
    months.push({ label, key, count: 0 });
  }

  for (const booking of bookings) {
    const created = new Date(booking.createdAt);
    if (Number.isNaN(created.getTime())) continue;

    const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.count += 1;
  }

  return months;
}

function DonutChart({ bookings }: { bookings: Booking[] }) {
  const counts = getStatusCounts(bookings);
  const total = bookings.length;
  const size = 160;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  let offset = 0;
  const segments = BOOKING_STATUSES.map((status) => {
    const count = counts[status];
    const fraction = total > 0 ? count / total : 0;
    const length = fraction * circumference;
    const segment = {
      status,
      count,
      color: statusColors[status],
      dasharray: `${length} ${circumference - length}`,
      dashoffset: -offset,
    };
    offset += length;
    return segment;
  }).filter((s) => s.count > 0);

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <div className="relative shrink-0">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Booking status breakdown">
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#f4f4f5"
            strokeWidth={stroke}
          />
          {segments.map((segment) => (
            <circle
              key={segment.status}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={stroke}
              strokeDasharray={segment.dasharray}
              strokeDashoffset={segment.dashoffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-midnight">{total}</span>
          <span className="text-xs text-muted">Total</span>
        </div>
      </div>

      <ul className="w-full space-y-2.5">
        {BOOKING_STATUSES.map((status) => {
          const count = counts[status];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <li key={status} className="flex items-center gap-3 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: statusColors[status] }}
              />
              <span className="flex-1 text-muted">{STATUS_LABELS[status]}</span>
              <span className="font-medium text-midnight">{count}</span>
              <span className="w-10 text-right text-muted/70">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function EventTypeChart({ bookings }: { bookings: Booking[] }) {
  const items = getEventTypeCounts(bookings);
  const max = Math.max(...items.map(([, count]) => count), 1);

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted">
        Event type breakdown will appear once bookings come in.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map(([label, count], index) => {
        const width = (count / max) * 100;
        const color = barColors[index % barColors.length];

        return (
          <li key={label}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-medium text-midnight">{label}</span>
              <span className="shrink-0 text-muted">{count}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-warm-beige">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${width}%`, backgroundColor: color }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function MonthlyTrendChart({ bookings }: { bookings: Booking[] }) {
  const months = getMonthlyCounts(bookings);
  const max = Math.max(...months.map((m) => m.count), 1);
  const chartHeight = 140;
  const barWidth = 28;
  const gap = 16;
  const width = months.length * barWidth + (months.length - 1) * gap + 24;
  const paddingBottom = 28;

  return (
    <div className="overflow-x-auto">
      <svg
        width={width}
        height={chartHeight + paddingBottom}
        viewBox={`0 0 ${width} ${chartHeight + paddingBottom}`}
        role="img"
        aria-label="Bookings over the last six months"
        className="mx-auto"
      >
        {months.map((month, index) => {
          const barHeight = month.count > 0 ? (month.count / max) * (chartHeight - 12) : 0;
          const x = 12 + index * (barWidth + gap);
          const y = chartHeight - barHeight;

          return (
            <g key={month.key}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight || 4}
                rx={6}
                fill={month.count > 0 ? "#1a1820" : "#ebe4d6"}
                opacity={month.count > 0 ? 1 : 0.5}
              />
              <text
                x={x + barWidth / 2}
                y={chartHeight + 18}
                textAnchor="middle"
                className="fill-muted text-[11px]"
              >
                {month.label}
              </text>
              {month.count > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="fill-midnight text-[11px] font-medium"
                >
                  {month.count}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <article className="admin-card p-6">
      <div className="mb-5">
        <h3 className="font-display text-xl text-midnight">{title}</h3>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      {children}
    </article>
  );
}

export function DashboardCharts({ bookings }: DashboardChartsProps) {
  if (bookings.length === 0) {
    return (
      <section className="admin-card p-8">
        <h3 className="font-display text-xl text-midnight">Analytics overview</h3>
        <p className="mt-2 text-sm text-muted">
          Charts will appear here once booking requests start coming in.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-2xl text-midnight">Analytics overview</h2>
        <p className="text-sm text-muted">
          Visual breakdown of bookings, event types, and recent trends
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard
          title="Status breakdown"
          description="Share of bookings by pipeline stage"
        >
          <DonutChart bookings={bookings} />
        </ChartCard>

        <ChartCard
          title="Event types"
          description="Most requested celebration categories"
        >
          <EventTypeChart bookings={bookings} />
        </ChartCard>

        <ChartCard
          title="Monthly trend"
          description="New requests over the last 6 months"
        >
          <MonthlyTrendChart bookings={bookings} />
        </ChartCard>
      </div>
    </section>
  );
}
