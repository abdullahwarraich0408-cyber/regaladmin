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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">Styling services</h3>
          <p className="text-sm text-zinc-500">
            Manage the interactive services showcase on the homepage and services page.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
            {items.length === 0 ? (
              <button
                type="button"
                onClick={loadDemoData}
                disabled={isPending}
                className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-100 disabled:opacity-60"
              >
                {isPending ? "Loading demo..." : "Load demo data"}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={isPending}
                  className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={reloadDemoData}
                  disabled={isPending}
                  className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-100 disabled:opacity-60"
                >
                  Reload demo data
                </button>
              </>
            )}
            <button
              type="button"
              onClick={openCreateForm}
              className="rounded-lg bg-[#12121a] px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Add service
            </button>
          </div>
      </div>

      {actionError ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {actionError}
        </p>
      ) : null}

      <Modal
        open={showForm}
        onClose={closeForm}
        title={editingItem ? "Edit service" : "Add service"}
      >
        <ServiceForm item={editingItem ?? undefined} onCancel={closeForm} />
      </Modal>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-10 text-center">
          <p className="text-lg font-medium text-zinc-900">No services yet</p>
          <p className="mt-2 text-sm text-zinc-500">
            Load demo data or add your own services before they appear on the website.
          </p>
          <button
            type="button"
            onClick={loadDemoData}
            disabled={isPending}
            className="mt-6 rounded-lg bg-[#12121a] px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
          >
            {isPending ? "Loading demo..." : "Load demo data"}
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Best for</th>
                <th className="px-4 py-3 font-medium">Highlights</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4">
                    <div className="font-medium text-zinc-900">{item.title}</div>
                    <div className="text-xs text-zinc-500">{item.slug}</div>
                  </td>
                  <td className="px-4 py-4 text-zinc-600">{item.bestFor}</td>
                  <td className="px-4 py-4 text-zinc-600">
                    {item.highlights.length} items
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {item.published ? "Published" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => openEditForm(item)}
                      className="font-medium text-zinc-900 transition hover:text-amber-700"
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
