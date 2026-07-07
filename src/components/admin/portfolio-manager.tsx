"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Modal } from "@/components/admin/modal";
import { PortfolioForm } from "@/components/admin/portfolio-form";
import { clearAllPortfolio, importPortfolioFromInstagram, seedDemoPortfolio } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media-url";
import type { PortfolioItem } from "@/lib/types";

interface PortfolioManagerProps {
  items: PortfolioItem[];
}

export function PortfolioManager({ items }: PortfolioManagerProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [demoError, setDemoError] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openCreateForm = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const openEditForm = (item: PortfolioItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const loadDemoData = () => {
    setDemoError(null);

    startTransition(async () => {
      try {
        await seedDemoPortfolio();
        router.refresh();
      } catch (error) {
        setDemoError(
          error instanceof Error
            ? error.message
            : "Could not load demo portfolio data."
        );
      }
    });
  };

  const reloadDemoData = () => {
    if (
      !window.confirm("Replace all portfolio items with fresh demo data?")
    ) {
      return;
    }

    setDemoError(null);

    startTransition(async () => {
      try {
        await clearAllPortfolio();
        await seedDemoPortfolio();
        router.refresh();
      } catch (error) {
        setDemoError(
          error instanceof Error
            ? error.message
            : "Could not reload demo portfolio data."
        );
      }
    });
  };

  const importFromInstagram = () => {
    setDemoError(null);
    setImportMessage(null);

    startTransition(async () => {
      try {
        const items = await importPortfolioFromInstagram(6);
        setImportMessage(`Imported ${items.length} event${items.length === 1 ? "" : "s"} from Instagram.`);
        router.refresh();
      } catch (error) {
        setDemoError(
          error instanceof Error ? error.message : "Could not import from Instagram."
        );
      }
    });
  };

  const clearAll = () => {
    if (!window.confirm("Remove all portfolio items from the website?")) {
      return;
    }

    setDemoError(null);

    startTransition(async () => {
      try {
        await clearAllPortfolio();
        router.refresh();
      } catch {
        setDemoError("Could not clear portfolio items.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">Portfolio items</h3>
          <p className="text-sm text-zinc-500">
            All website portfolio content is managed here. Nothing is shown on
            the public site until you add it.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
            {items.length === 0 ? (
              <>
                <button
                  type="button"
                  onClick={loadDemoData}
                  disabled={isPending}
                  className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-100 disabled:opacity-60"
                >
                  {isPending ? "Loading demo..." : "Load demo data"}
                </button>
                <button
                  type="button"
                  onClick={importFromInstagram}
                  disabled={isPending}
                  className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-900 transition hover:bg-violet-100 disabled:opacity-60"
                >
                  {isPending ? "Importing..." : "Import from Instagram"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={importFromInstagram}
                  disabled={isPending}
                  className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-900 transition hover:bg-violet-100 disabled:opacity-60"
                >
                  {isPending ? "Importing..." : "Import from Instagram"}
                </button>
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
              Add item
            </button>
          </div>
      </div>

      {demoError ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {demoError}
        </p>
      ) : null}

      {importMessage ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {importMessage}
        </p>
      ) : null}

      <Modal
        open={showForm}
        onClose={closeForm}
        title={editingItem ? "Edit portfolio story" : "Add portfolio story"}
      >
        <PortfolioForm item={editingItem ?? undefined} onCancel={closeForm} />
      </Modal>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-10 text-center">
          <p className="text-lg font-medium text-zinc-900">No portfolio items yet</p>
          <p className="mt-2 text-sm text-zinc-500">
            Click <strong>Import from Instagram</strong> to pull your latest event photos,
            or <strong>Load demo data</strong> for sample stories with images.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={importFromInstagram}
              disabled={isPending}
              className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-900 transition hover:bg-violet-100 disabled:opacity-60"
            >
              {isPending ? "Importing..." : "Import from Instagram"}
            </button>
            <button
              type="button"
              onClick={loadDemoData}
              disabled={isPending}
              className="rounded-lg bg-[#12121a] px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
            >
              {isPending ? "Loading demo..." : "Load demo data"}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => {
            const [colorA, colorB] = item.palette;

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveMediaUrl(item.imageUrl)}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{
                        background: `linear-gradient(135deg, ${colorA} 0%, ${colorB} 100%)`,
                      }}
                    />
                  )}
                </div>

                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        {item.category}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold text-zinc-900">
                        {item.title}
                      </h4>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {item.published ? "Published" : "Hidden"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-zinc-500">
                    <span>Sort order: {item.sortOrder}</span>
                    <button
                      type="button"
                      onClick={() => openEditForm(item)}
                      className="font-medium text-zinc-900 transition hover:text-amber-700"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
