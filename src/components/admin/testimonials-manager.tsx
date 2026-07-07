"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { seedDemoTestimonials } from "@/lib/api";
import type { TestimonialItem } from "@/lib/types";
import { Modal } from "@/components/admin/modal";
import { TestimonialForm } from "./testimonial-form";

interface TestimonialsManagerProps {
  items: TestimonialItem[];
}

export function TestimonialsManager({ items }: TestimonialsManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<TestimonialItem | "new" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const loadDemo = () => {
    startTransition(async () => {
      try {
        await seedDemoTestimonials();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load demo data");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">Testimonials</h2>
          <p className="text-sm text-zinc-500">Manage client quotes and Google reviews shown on the homepage.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadDemo}
            disabled={isPending}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium"
          >
            Load demo data
          </button>
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="rounded-lg bg-[#12121a] px-4 py-2 text-sm font-medium text-white"
          >
            Add testimonial
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Add testimonial" : "Edit testimonial"}
      >
        <TestimonialForm
          item={editing === "new" || editing === null ? undefined : editing}
          onCancel={() => setEditing(null)}
        />
      </Modal>

      <div className="grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm leading-relaxed text-zinc-700">&ldquo;{item.quote}&rdquo;</p>
                <p className="mt-3 text-sm font-semibold text-zinc-900">
                  {item.name} · {item.event}
                </p>
                <p className="text-xs text-zinc-500">
                  {item.source === "google" ? "Google Review" : "Client"} · {item.rating}★ ·{" "}
                  {item.published ? "Published" : "Draft"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(item)}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm"
              >
                Edit
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
