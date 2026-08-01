"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createInstagramPost,
  deleteInstagramPost,
  updateInstagramPost,
} from "@/lib/api";
import type { InstagramPostInput, InstagramPostItem } from "@/lib/types";
import { ImageUrlField } from "@/components/admin/media-picker";

interface InstagramPostFormProps {
  item?: InstagramPostItem;
  onCancel: () => void;
}

const emptyForm: InstagramPostInput = {
  caption: "",
  imageUrl: "",
  videoUrl: "",
  postUrl: "",
  shortcode: "",
  likes: 0,
  isVideo: false,
  isReel: false,
  published: true,
  sortOrder: 0,
};

export function InstagramPostForm({ item, onCancel }: InstagramPostFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<InstagramPostInput>(
    item
      ? {
          caption: item.caption,
          imageUrl: item.imageUrl,
          videoUrl: item.videoUrl,
          postUrl: item.postUrl,
          shortcode: item.shortcode,
          likes: item.likes,
          isVideo: item.isVideo,
          isReel: item.isReel,
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

    if (!form.imageUrl.trim()) {
      setError("Please add an image.");
      return;
    }

    startTransition(async () => {
      try {
        if (item) {
          await updateInstagramPost(item.id, form);
        } else {
          await createInstagramPost(form);
        }
        router.refresh();
        onCancel();
      } catch {
        setError("Could not save Instagram post.");
      }
    });
  };

  const onDelete = () => {
    if (!item || !window.confirm("Delete this Instagram post?")) return;

    startTransition(async () => {
      try {
        await deleteInstagramPost(item.id);
        router.refresh();
        onCancel();
      } catch {
        setError("Could not delete Instagram post.");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-6">
      <h3 className="text-lg font-semibold">
        {item ? "Edit Instagram post" : "Add Instagram post"}
      </h3>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-midnight">Caption</span>
        <textarea
          required
          rows={4}
          value={form.caption}
          onChange={(e) => setForm((c) => ({ ...c, caption: e.target.value }))}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="Describe the event or styling moment..."
        />
      </label>

      <ImageUrlField
        label="Image"
        value={form.imageUrl ?? ""}
        onChange={(imageUrl) => setForm((c) => ({ ...c, imageUrl }))}
        placeholder="https://your-cdn.com/instagram-post.jpg"
      />

      <label className="block space-y-2">
        <span className="text-sm font-medium text-midnight">Video URL (optional)</span>
        <input
          value={form.videoUrl ?? ""}
          onChange={(e) => setForm((c) => ({ ...c, videoUrl: e.target.value }))}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="https://...mp4"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-midnight">Instagram post URL (optional)</span>
        <input
          value={form.postUrl ?? ""}
          onChange={(e) => setForm((c) => ({ ...c, postUrl: e.target.value }))}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="https://www.instagram.com/p/..."
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-midnight">Likes</span>
          <input
            type="number"
            min={0}
            value={form.likes ?? 0}
            onChange={(e) =>
              setForm((c) => ({ ...c, likes: Number(e.target.value) || 0 }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-midnight">Sort order</span>
          <input
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) =>
              setForm((c) => ({ ...c, sortOrder: Number(e.target.value) || 0 }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-3 pt-8">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((c) => ({ ...c, published: e.target.checked }))}
          />
          <span className="text-sm">Published</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(form.isVideo)}
            onChange={(e) => setForm((c) => ({ ...c, isVideo: e.target.checked }))}
          />
          Is video
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(form.isReel)}
            onChange={(e) => setForm((c) => ({ ...c, isReel: e.target.checked }))}
          />
          Is reel
        </label>
      </div>

      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Cancel
        </button>
        {item ? (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-rose-200 px-4 py-2 text-sm text-rose-700"
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
