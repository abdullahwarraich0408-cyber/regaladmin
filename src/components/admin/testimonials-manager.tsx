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
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button type="button" onClick={loadDemo} disabled={isPending} className="btn-gold">
          Load demo data
        </button>
        <button type="button" onClick={() => setEditing("new")} className="btn-primary">
          Add testimonial
        </button>
      </div>

      {error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}

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

      {items.length === 0 ? (
        <div className="admin-card border-dashed p-10 text-center">
          <p className="font-display text-2xl text-midnight">No testimonials yet</p>
          <p className="mt-2 text-sm text-muted">
            Add client quotes or Google reviews to build trust on the homepage.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="admin-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm leading-relaxed text-foreground/85">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <p className="mt-3 text-sm font-semibold text-midnight">
                    {item.name} · {item.event}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {item.source === "google" ? "Google Review" : "Client"} · {item.rating}★ ·{" "}
                    <span className={item.published ? "published-pill" : "draft-pill"}>
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </p>
                </div>
                <button type="button" onClick={() => setEditing(item)} className="btn-secondary">
                  Edit
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
