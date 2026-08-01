"use client";

import { usePathname } from "next/navigation";
import { getPageMeta } from "@/lib/admin-nav";

export function AdminHeader() {
  const pathname = usePathname();
  const meta = getPageMeta(pathname);

  return (
    <header className="border-b border-border/80 bg-card/90 px-4 py-5 backdrop-blur-sm sm:px-8">
      <div className="pl-14 lg:pl-0">
        <p className="eyebrow">Regal Knot Events</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight text-midnight sm:text-4xl">
          {meta.title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted">{meta.description}</p>
      </div>
    </header>
  );
}
