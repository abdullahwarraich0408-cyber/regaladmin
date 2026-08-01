"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Modal } from "@/components/admin/modal";
import { EventTypeForm } from "@/components/admin/event-type-form";
import {
  clearAllEventTypes,
  seedDemoEventTypes,
} from "@/lib/api";
import type { EventTypeItem } from "@/lib/types";

interface EventTypesManagerProps {
  items: EventTypeItem[];
}

export function EventTypesManager({ items }: EventTypesManagerProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<EventTypeItem | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openCreateForm = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const openEditForm = (item: EventTypeItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const loadDemoData = () => {
    setActionError(null);

    startTransition(async () => {
      try {
        await seedDemoEventTypes();
        router.refresh();
      } catch (error) {
        setActionError(
          error instanceof Error ? error.message : "Could not load demo event types."
        );
      }
    });
  };

  const reloadDemoData = () => {
    if (!window.confirm("Replace all event types with fresh demo data?")) {
      return;
    }

    setActionError(null);

    startTransition(async () => {
      try {
        await clearAllEventTypes();
        await seedDemoEventTypes();
        router.refresh();
      } catch (error) {
        setActionError(
          error instanceof Error ? error.message : "Could not reload demo event types."
        );
      }
    });
  };

  const clearAll = () => {
    if (!window.confirm("Remove all event types from the booking form?")) {
      return;
    }

    setActionError(null);

    startTransition(async () => {
      try {
        await clearAllEventTypes();
        router.refresh();
      } catch {
        setActionError("Could not clear event types.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-3">
        {items.length === 0 ? (
          <button type="button" onClick={loadDemoData} disabled={isPending} className="btn-gold">
            {isPending ? "Loading demo..." : "Load demo data"}
          </button>
        ) : (
          <>
            <button type="button" onClick={clearAll} disabled={isPending} className="btn-danger">
              Clear all
            </button>
            <button type="button" onClick={reloadDemoData} disabled={isPending} className="btn-gold">
              Reload demo data
            </button>
          </>
        )}
        <button type="button" onClick={openCreateForm} className="btn-primary">
          Add event type
        </button>
      </div>

      {actionError ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{actionError}</p>
      ) : null}

      <Modal
        open={showForm}
        onClose={closeForm}
        title={editingItem ? "Edit event type" : "Add event type"}
      >
        <EventTypeForm item={editingItem ?? undefined} onCancel={closeForm} />
      </Modal>

      {items.length === 0 ? (
        <div className="admin-card border-dashed p-10 text-center">
          <p className="font-display text-2xl text-midnight">No event types yet</p>
          <p className="mt-2 text-sm text-muted">
            These power the booking form on the public website. Load demo data or add your own.
          </p>
          <button
            type="button"
            onClick={loadDemoData}
            disabled={isPending}
            className="btn-primary mt-6"
          >
            {isPending ? "Loading demo..." : "Load demo data"}
          </button>
        </div>
      ) : (
        <div className="admin-card">
          <table className="min-w-full divide-y divide-border text-left text-sm">
            <thead className="bg-warm-beige/50 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Icon</th>
                <th className="px-4 py-3 font-medium">Sort</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-warm-beige/30">
                  <td className="px-4 py-4 font-medium text-midnight">{item.name}</td>
                  <td className="px-4 py-4 text-muted">{item.icon}</td>
                  <td className="px-4 py-4 text-muted">{item.sortOrder}</td>
                  <td className="px-4 py-4">
                    <span className={item.published ? "published-pill" : "draft-pill"}>
                      {item.published ? "Published" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => openEditForm(item)}
                      className="font-semibold text-deep-plum transition hover:text-dusty-rose"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
