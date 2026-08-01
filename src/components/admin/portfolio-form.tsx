"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  createPortfolioItem,
  deletePortfolioItem,
  updatePortfolioItem,
} from "@/lib/api";
import { GalleryUrlsField, ImageUrlField } from "@/components/admin/media-picker";
import type { PortfolioInput, PortfolioItem } from "@/lib/types";
import { DEFAULT_PALETTE, PORTFOLIO_CATEGORIES } from "@/lib/types";

interface PortfolioFormProps {
  item?: PortfolioItem;
  onCancel: () => void;
}

const emptyForm: PortfolioInput = {
  title: "",
  category: "Weddings",
  imageUrl: "",
  gallery: [],
  clientName: "",
  description: "",
  highlights: [],
  instagramUrl: "",
  palette: DEFAULT_PALETTE,
  published: true,
  sortOrder: 0,
};

export function PortfolioForm({ item, onCancel }: PortfolioFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PortfolioInput>(
    item
      ? {
          title: item.title,
          category: item.category,
          imageUrl: item.imageUrl,
          gallery: item.gallery ?? [],
          clientName: item.clientName ?? "",
          description: item.description ?? "",
          highlights: item.highlights ?? [],
          instagramUrl: item.instagramUrl ?? "",
          palette: item.palette,
          published: item.published,
          sortOrder: item.sortOrder,
        }
      : emptyForm
  );
  const [highlightsText, setHighlightsText] = useState((item?.highlights ?? []).join("\n"));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const payload: PortfolioInput = {
      ...form,
      highlights: highlightsText.split("\n").map((s) => s.trim()).filter(Boolean),
    };

    startTransition(async () => {
      try {
        if (item) {
          await updatePortfolioItem(item.id, payload);
        } else {
          await createPortfolioItem(payload);
        }
        router.refresh();
        onCancel();
      } catch {
        setError("Could not save portfolio item. Check the form and try again.");
      }
    });
  };

  const onDelete = () => {
    if (!item || !window.confirm(`Delete "${item.title}" from the portfolio?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deletePortfolioItem(item.id);
        router.refresh();
        onCancel();
      } catch {
        setError("Could not delete this portfolio item.");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5 p-6">
      <div>
        <h3 className="text-lg font-semibold text-midnight">
          {item ? "Edit portfolio story" : "Add portfolio story"}
        </h3>
        <p className="text-sm text-muted">
          Real event content only — cover image, gallery, and story details appear on the website.
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-midnight">Event title</span>
        <input
          required
          value={form.title}
          onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-soft-gold"
          placeholder="Champagne & Ivory Reception"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-midnight">Category</span>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((c) => ({ ...c, category: e.target.value as PortfolioInput["category"] }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-soft-gold"
          >
            {PORTFOLIO_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-midnight">Client name</span>
          <input
            value={form.clientName ?? ""}
            onChange={(e) => setForm((c) => ({ ...c, clientName: e.target.value }))}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-soft-gold"
            placeholder="Sarah & James"
          />
        </label>
      </div>

      <ImageUrlField
        label="Cover image"
        value={form.imageUrl ?? ""}
        onChange={(imageUrl) => setForm((c) => ({ ...c, imageUrl }))}
        placeholder="https://your-cdn.com/event-cover.jpg"
      />

      <GalleryUrlsField
        label="Gallery images"
        value={form.gallery ?? []}
        onChange={(gallery) => setForm((c) => ({ ...c, gallery }))}
      />

      <label className="block space-y-2">
        <span className="text-sm font-medium text-midnight">Event story</span>
        <textarea
          value={form.description ?? ""}
          onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))}
          rows={4}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-soft-gold"
          placeholder="Describe the event, styling approach, and outcome..."
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-midnight">Highlights</span>
        <textarea
          value={highlightsText}
          onChange={(e) => setHighlightsText(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-soft-gold"
          placeholder="One highlight per line"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-midnight">Instagram post URL</span>
        <input
          type="url"
          value={form.instagramUrl ?? ""}
          onChange={(e) => setForm((c) => ({ ...c, instagramUrl: e.target.value }))}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-soft-gold"
          placeholder="https://instagram.com/p/..."
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-midnight">Sort order</span>
          <input
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) => setForm((c) => ({ ...c, sortOrder: Number(e.target.value) }))}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-soft-gold"
          />
        </label>
        <label className="flex items-center gap-3 pt-8">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((c) => ({ ...c, published: e.target.checked }))}
            className="h-4 w-4 rounded border-border"
          />
          <span className="text-sm font-medium text-midnight">Published on website</span>
        </label>
      </div>

      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary"
        >
          {isPending ? "Saving..." : item ? "Save changes" : "Add story"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        {item ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={isPending}
            className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700"
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
