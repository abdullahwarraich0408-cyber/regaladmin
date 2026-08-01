"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  clearAllInstagramPosts,
  seedDemoInstagramPosts,
} from "@/lib/api";
import type { InstagramPostItem } from "@/lib/types";
import { resolveMediaUrl } from "@/lib/media-url";
import { Modal } from "@/components/admin/modal";
import { InstagramPostForm } from "./instagram-post-form";

interface InstagramManagerProps {
  items: InstagramPostItem[];
}

export function InstagramManager({ items }: InstagramManagerProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<InstagramPostItem | "new" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadDemo = () => {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        const created = await seedDemoInstagramPosts();
        setMessage(`Loaded ${created.length} realistic Instagram posts (including reels).`);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load demo data");
      }
    });
  };

  const clearAll = () => {
    if (!window.confirm("Clear all Instagram section posts?")) return;
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        await clearAllInstagramPosts();
        setMessage("Cleared all Instagram posts.");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to clear posts");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button type="button" onClick={loadDemo} disabled={isPending} className="btn-gold">
          {isPending ? "Working..." : "Load demo data"}
        </button>
        {items.length > 0 ? (
          <button type="button" onClick={clearAll} disabled={isPending} className="btn-danger">
            Clear all
          </button>
        ) : null}
        <button type="button" onClick={() => setEditing("new")} className="btn-primary">
          Add post
        </button>
      </div>

      {error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}
      {message ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>
      ) : null}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Add Instagram post" : "Edit Instagram post"}
      >
        <InstagramPostForm
          item={editing === "new" || editing === null ? undefined : editing}
          onCancel={() => setEditing(null)}
        />
      </Modal>

      {items.length === 0 ? (
        <div className="admin-card border-dashed px-6 py-12 text-center">
          <p className="font-display text-2xl text-midnight">No Instagram posts yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Add real posts from your feed for social proof on the homepage, or load demo
            data while testing.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={loadDemo} disabled={isPending} className="btn-gold">
              Load demo data
            </button>
            <button type="button" onClick={() => setEditing("new")} className="btn-primary">
              Add post
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="admin-card">
              <div className="aspect-[4/5] bg-warm-beige">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveMediaUrl(item.imageUrl)}
                  alt={item.caption.slice(0, 80) || "Instagram post"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-3 p-4">
                <p className="line-clamp-3 text-sm text-foreground">{item.caption}</p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-muted">
                    {item.published ? "Published" : "Draft"} · Sort {item.sortOrder}
                    {item.isReel || item.isVideo ? " · Reel/Video" : ""}
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditing(item)}
                    className="btn-secondary !px-3 !py-1.5 text-xs"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
