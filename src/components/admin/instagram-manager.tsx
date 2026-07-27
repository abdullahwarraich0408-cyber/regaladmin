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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">Instagram section</h2>
          <p className="text-sm text-zinc-500">
            Manually manage posts shown in the website Instagram carousel. Published
            items appear on the homepage.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadDemo}
            disabled={isPending}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium"
          >
            {isPending ? "Working..." : "Load demo data"}
          </button>
          {items.length > 0 ? (
            <button
              type="button"
              onClick={clearAll}
              disabled={isPending}
              className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700"
            >
              Clear all
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="rounded-lg bg-[#12121a] px-4 py-2 text-sm font-medium text-white"
          >
            Add post
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

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
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
          <p className="text-lg font-semibold text-zinc-900">No Instagram posts yet</p>
          <p className="mt-2 text-sm text-zinc-500">
            Click Load demo data for sample posts, or Add post to upload your own.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={loadDemo}
              disabled={isPending}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium"
            >
              Load demo data
            </button>
            <button
              type="button"
              onClick={() => setEditing("new")}
              className="rounded-lg bg-[#12121a] px-4 py-2 text-sm font-medium text-white"
            >
              Add post
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
            >
              <div className="aspect-[4/5] bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveMediaUrl(item.imageUrl)}
                  alt={item.caption.slice(0, 80) || "Instagram post"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-3 p-4">
                <p className="line-clamp-3 text-sm text-zinc-700">{item.caption}</p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-zinc-500">
                    {item.published ? "Published" : "Draft"} · Sort {item.sortOrder}
                    {item.isReel || item.isVideo ? " · Reel/Video" : ""}
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditing(item)}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm"
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
