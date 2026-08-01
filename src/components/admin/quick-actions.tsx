import Link from "next/link";
import { adminNavItems } from "@/lib/admin-nav";

const actions = adminNavItems.filter((item) => item.href !== "/");

const accents = [
  "text-sky-700 bg-sky-50 ring-sky-100",
  "text-deep-plum bg-dusty-rose/15 ring-dusty-rose/25",
  "text-amber-800 bg-soft-gold/20 ring-soft-gold/30",
  "text-emerald-700 bg-emerald-50 ring-emerald-100",
  "text-violet-700 bg-violet-50 ring-violet-100",
  "text-rose-700 bg-rose-50 ring-rose-100",
  "text-midnight bg-warm-beige ring-border",
];

export function QuickActions() {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-display text-2xl text-midnight">Quick actions</h3>
        <p className="text-sm text-muted">Jump to the content that powers the live website.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action, index) => (
          <Link
            key={action.href}
            href={action.href}
            className="admin-card group flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ${accents[index % accents.length]}`}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                <path
                  d={action.icon}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>
              <span className="block font-semibold text-midnight group-hover:text-deep-plum">
                {action.label}
              </span>
              <span className="mt-1 block text-sm text-muted">{action.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
