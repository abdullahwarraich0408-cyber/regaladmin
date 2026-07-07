"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  createEventType,
  deleteEventType,
  updateEventType,
} from "@/lib/api";
import type { EventTypeInput, EventTypeItem } from "@/lib/types";
import { EVENT_TYPE_ICONS } from "@/lib/types";

interface EventTypeFormProps {
  item?: EventTypeItem;
  onCancel: () => void;
}

const emptyForm: EventTypeInput = {
  name: "",
  icon: "sparkles",
  published: true,
  sortOrder: 0,
};

export function EventTypeForm({ item, onCancel }: EventTypeFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<EventTypeInput>(
    item
      ? {
          name: item.name,
          icon: item.icon,
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
          await updateEventType(item.id, form);
        } else {
          await createEventType(form);
        }
        router.refresh();
        onCancel();
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Could not save event type."
        );
      }
    });
  };

  const onDelete = () => {
    if (!item) {
      return;
    }

    if (!window.confirm(`Delete "${item.name}" from event types?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteEventType(item.id);
        router.refresh();
        onCancel();
      } catch {
        setError("Could not delete this event type.");
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
          {item ? "Edit event type" : "Add event type"}
        </h3>
        <p className="text-sm text-zinc-500">
          Published types appear on the Plan My Event booking form.
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-700">Name</span>
        <input
          required
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
          placeholder="Wedding"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-700">Icon</span>
        <select
          value={form.icon}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              icon: event.target.value as EventTypeInput["icon"],
            }))
          }
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
        >
          {EVENT_TYPE_ICONS.map((icon) => (
            <option key={icon} value={icon}>
              {icon}
            </option>
          ))}
        </select>
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
            Published on booking form
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
          {isPending ? "Saving..." : item ? "Save changes" : "Add event type"}
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
