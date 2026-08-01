"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  createService,
  deleteService,
  updateService,
} from "@/lib/api";
import type { ServiceInput, ServiceItem } from "@/lib/types";
import { SERVICE_ICONS } from "@/lib/types";
import { ImageUrlField } from "@/components/admin/media-picker";

interface ServiceFormProps {
  item?: ServiceItem;
  onCancel: () => void;
}

const emptyForm: ServiceInput = {
  title: "",
  slug: "",
  icon: "sparkles",
  bestFor: "",
  shortDescription: "",
  longDescription: "",
  highlights: [],
  imageUrl: "",
  published: true,
  sortOrder: 0,
};

function highlightsToText(highlights: string[]) {
  return highlights.join("\n");
}

function textToHighlights(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function ServiceForm({ item, onCancel }: ServiceFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ServiceInput>(
    item
      ? {
          title: item.title,
          slug: item.slug,
          icon: item.icon,
          bestFor: item.bestFor,
          shortDescription: item.short,
          longDescription: item.long,
          highlights: item.highlights,
          imageUrl: item.imageUrl ?? "",
          published: item.published,
          sortOrder: item.sortOrder,
        }
      : emptyForm
  );
  const [highlightsText, setHighlightsText] = useState(
    item ? highlightsToText(item.highlights) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const payload: ServiceInput = {
      ...form,
      highlights: textToHighlights(highlightsText),
    };

    startTransition(async () => {
      try {
        if (item) {
          await updateService(item.id, payload);
        } else {
          await createService(payload);
        }
        router.refresh();
        onCancel();
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Could not save service."
        );
      }
    });
  };

  const onDelete = () => {
    if (!item) {
      return;
    }

    if (!window.confirm(`Delete "${item.title}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteService(item.id);
        router.refresh();
        onCancel();
      } catch {
        setError("Could not delete this service.");
      }
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 p-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">
          {item ? "Edit service" : "Add service"}
        </h3>
        <p className="text-sm text-zinc-500">
          Published services appear on the homepage showcase and services page.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Title</span>
          <input
            required
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
            placeholder="Wedding Decor"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">
            Slug{" "}
            <span className="font-normal text-zinc-400">(optional)</span>
          </span>
          <input
            value={form.slug ?? ""}
            onChange={(event) =>
              setForm((current) => ({ ...current, slug: event.target.value }))
            }
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
            placeholder="Leave blank to auto-generate"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Best for</span>
          <input
            required
            value={form.bestFor}
            onChange={(event) =>
              setForm((current) => ({ ...current, bestFor: event.target.value }))
            }
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
            placeholder="Brides & couples"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Icon</span>
          <select
            value={form.icon}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                icon: event.target.value as ServiceInput["icon"],
              }))
            }
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
          >
            {SERVICE_ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-700">
          Short description{" "}
          <span className="font-normal text-zinc-400">(min 10 characters)</span>
        </span>
        <textarea
          required
          minLength={10}
          maxLength={300}
          rows={2}
          value={form.shortDescription}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              shortDescription: event.target.value,
            }))
          }
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
        />
      </label>

      <ImageUrlField
        label="Card image"
        value={form.imageUrl ?? ""}
        onChange={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))}
        placeholder="https://your-cdn.com/service-cover.jpg"
      />

      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-700">
          Long description{" "}
          <span className="font-normal text-zinc-400">(min 20 characters)</span>
        </span>
        <textarea
          required
          minLength={20}
          maxLength={2000}
          rows={4}
          value={form.longDescription}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              longDescription: event.target.value,
            }))
          }
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-700">
          What's included (one item per line)
        </span>
        <textarea
          rows={5}
          value={highlightsText}
          onChange={(event) => setHighlightsText(event.target.value)}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
          placeholder={"Ceremony Arches & Aisles\nBespoke Table Settings"}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Sort order</span>
          <input
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                sortOrder: Number(event.target.value),
              }))
            }
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
          />
        </label>

        <label className="flex items-center gap-3 pt-8">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                published: event.target.checked,
              }))
            }
            className="h-4 w-4 rounded border-zinc-300"
          />
          <span className="text-sm font-medium text-zinc-700">
            Published on website
          </span>
        </label>
      </div>

      {error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[#12121a] px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
        >
          {isPending ? "Saving..." : item ? "Save changes" : "Add service"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          Cancel
        </button>
        {item ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={isPending}
            className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
