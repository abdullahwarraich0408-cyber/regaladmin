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
      <div className="flex flex-wrap items-center justify-end gap-3">
        {items.length === 0 ? (
          <>
            <button type="button" onClick={loadDemoData} disabled={isPending} className="btn-gold">
              {isPending ? "Loading demo..." : "Load demo data"}
            </button>
            <button
              type="button"
              onClick={importFromInstagram}
              disabled={isPending}
              className="btn-secondary"
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
              className="btn-secondary"
            >
              {isPending ? "Importing..." : "Import from Instagram"}
            </button>
            <button type="button" onClick={clearAll} disabled={isPending} className="btn-danger">
              Clear all
            </button>
            <button type="button" onClick={reloadDemoData} disabled={isPending} className="btn-gold">
              Reload demo data
            </button>
          </>
        )}
        <button type="button" onClick={openCreateForm} className="btn-primary">
          Add item
        </button>
      </div>

      {demoError ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{demoError}</p>
      ) : null}

      {importMessage ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
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
        <div className="admin-card border-dashed p-10 text-center">
          <p className="font-display text-2xl text-midnight">No portfolio items yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Import from Instagram for real event photos, or load demo data for sample
            stories. Prefer real client work on production.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={importFromInstagram}
              disabled={isPending}
              className="btn-secondary"
            >
              {isPending ? "Importing..." : "Import from Instagram"}
            </button>
            <button
              type="button"
              onClick={loadDemoData}
              disabled={isPending}
              className="btn-gold"
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
              <article key={item.id} className="admin-card">
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
                      <p className="text-xs uppercase tracking-wide text-muted">
                        {item.category}
                      </p>
                      <h4 className="mt-1 font-display text-xl text-midnight">
                        {item.title}
                      </h4>
                    </div>
                    <span className={item.published ? "published-pill" : "draft-pill"}>
                      {item.published ? "Published" : "Hidden"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted">
                    <span>Sort order: {item.sortOrder}</span>
                    <button
                      type="button"
                      onClick={() => openEditForm(item)}
                      className="font-semibold text-midnight transition hover:text-deep-plum"
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
