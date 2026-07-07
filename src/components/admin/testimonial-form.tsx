"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createTestimonial, deleteTestimonial, updateTestimonial } from "@/lib/api";
import type { TestimonialInput, TestimonialItem } from "@/lib/types";

interface TestimonialFormProps {
  item?: TestimonialItem;
  onCancel: () => void;
}

const emptyForm: TestimonialInput = {
  quote: "",
  name: "",
  event: "",
  rating: 5,
  source: "client",
  published: true,
  sortOrder: 0,
};

export function TestimonialForm({ item, onCancel }: TestimonialFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<TestimonialInput>(
    item
      ? {
          quote: item.quote,
          name: item.name,
          event: item.event,
          rating: item.rating,
          source: item.source,
          published: item.published,
          sortOrder: item.sortOrder,
        }
      : emptyForm
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        if (item) {
          await updateTestimonial(item.id, form);
        } else {
          await createTestimonial(form);
        }
        router.refresh();
        onCancel();
      } catch {
        setError("Could not save testimonial.");
      }
    });
  };

  const onDelete = () => {
    if (!item || !window.confirm(`Delete testimonial from ${item.name}?`)) return;

    startTransition(async () => {
      try {
        await deleteTestimonial(item.id);
        router.refresh();
        onCancel();
      } catch {
        setError("Could not delete testimonial.");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-6">
      <h3 className="text-lg font-semibold">{item ? "Edit testimonial" : "Add testimonial"}</h3>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-700">Quote</span>
        <textarea
          required
          rows={4}
          value={form.quote}
          onChange={(e) => setForm((c) => ({ ...c, quote: e.target.value }))}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Name</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Event</span>
          <input
            required
            value={form.event}
            onChange={(e) => setForm((c) => ({ ...c, event: e.target.value }))}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Rating</span>
          <select
            value={form.rating}
            onChange={(e) => setForm((c) => ({ ...c, rating: Number(e.target.value) }))}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} stars</option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Source</span>
          <select
            value={form.source}
            onChange={(e) => setForm((c) => ({ ...c, source: e.target.value as TestimonialInput["source"] }))}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          >
            <option value="client">Client</option>
            <option value="google">Google Review</option>
          </select>
        </label>
        <label className="flex items-center gap-3 pt-8">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((c) => ({ ...c, published: e.target.checked }))}
          />
          <span className="text-sm">Published</span>
        </label>
      </div>

      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={isPending} className="rounded-lg bg-[#12121a] px-4 py-2 text-sm font-medium text-white">
          {isPending ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
        {item ? (
          <button type="button" onClick={onDelete} className="rounded-lg border border-rose-200 px-4 py-2 text-sm text-rose-700">
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
