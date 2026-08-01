"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { adminNavItems, navGroups } from "@/lib/admin-nav";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <>
      <div className="border-b border-white/10 px-5 py-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-soft-gold to-[#a8842f] text-[11px] font-bold tracking-widest text-midnight shadow-sm">
            RK
          </span>
          <div>
            <p className="font-display text-lg leading-none text-cream">Regal Knot</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-soft-gold/80">
              Admin
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
        {navGroups.map((group) => {
          const items = adminNavItems.filter((item) => item.group === group.id);
          return (
            <div key={group.id}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/40">
                {group.label}
              </p>
              <div className="space-y-1">
                {items.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-soft-gold/15 text-cream ring-1 ring-soft-gold/30"
                          : "text-cream/70 hover:bg-white/5 hover:text-cream"
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`h-4 w-4 shrink-0 ${active ? "text-soft-gold" : "text-cream/40"}`}
                        aria-hidden
                      >
                        <path
                          d={item.icon}
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs font-semibold text-cream/90">Website CMS</p>
          <p className="mt-1 text-xs leading-relaxed text-cream/50">
            Edit what visitors see on the live site — services, portfolio, Instagram &amp; more.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-midnight shadow-sm lg:hidden"
        aria-label="Open menu"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-midnight/50"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-midnight text-cream shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg text-cream/70 hover:bg-white/10"
              aria-label="Close"
            >
              ✕
            </button>
            {nav}
          </aside>
        </div>
      ) : null}

      <aside className="hidden w-64 shrink-0 flex-col bg-midnight text-cream lg:flex">
        {nav}
      </aside>
    </>
  );
}
