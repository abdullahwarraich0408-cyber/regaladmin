"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Modal } from "@/components/admin/modal";
import { ServiceForm } from "@/components/admin/service-form";
import {
  clearAllServices,
  seedDemoServices,
} from "@/lib/api";
import type { ServiceItem } from "@/lib/types";
import { resolveMediaUrl } from "@/lib/media-url";

interface ServicesManagerProps {
  items: ServiceItem[];
}

export function ServicesManager({ items }: ServicesManagerProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openCreateForm = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const openEditForm = (item: ServiceItem) => {
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
        await seedDemoServices();
        router.refresh();
      } catch (error) {
        setActionError(
          error instanceof Error ? error.message : "Could not load demo services."
        );
      }
    });
  };

  const reloadDemoData = () => {
    if (!window.confirm("Replace all services with fresh demo data?")) {
      return;
    }

    setActionError(null);

    startTransition(async () => {
      try {
        await clearAllServices();
        await seedDemoServices();
        router.refresh();
      } catch (error) {
        setActionError(
          error instanceof Error ? error.message : "Could not reload demo services."
        );
      }
    });
  };

  const clearAll = () => {
    if (!window.confirm("Remove all services from the website?")) {
      return;
    }

    setActionError(null);

    startTransition(async () => {
      try {
        await clearAllServices();
        router.refresh();
      } catch {
        setActionError("Could not clear services.");
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
          Add service
        </button>
      </div>

      {actionError ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{actionError}</p>
      ) : null}

      <Modal
        open={showForm}
        onClose={closeForm}
        title={editingItem ? "Edit service" : "Add service"}
      >
        <ServiceForm item={editingItem ?? undefined} onCancel={closeForm} />
      </Modal>

      {items.length === 0 ? (
        <div className="admin-card border-dashed p-10 text-center">
          <p className="font-display text-2xl text-midnight">No services yet</p>
          <p className="mt-2 text-sm text-muted">
            Services appear on the homepage pillars and services page. Add real offerings (avoid demo
            stock images in production).
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
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Best for</th>
                <th className="px-4 py-3 font-medium">Highlights</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-warm-beige/30">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-warm-beige">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={resolveMediaUrl(item.imageUrl)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <div className="font-medium text-midnight">{item.title}</div>
                        <div className="text-xs text-muted">{item.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted">{item.bestFor}</td>
                  <td className="px-4 py-4 text-muted">{item.highlights.length} items</td>
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
