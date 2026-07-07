"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { getInstagramFeed, getPortfolioItems, uploadImage, uploadImages } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media-url";

interface GalleryImage {
  url: string;
  label: string;
  source: "instagram" | "portfolio" | "upload";
}

function collectPortfolioImages(
  items: Awaited<ReturnType<typeof getPortfolioItems>>,
  excludeUrls: Set<string>
) {
  const images: GalleryImage[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    const urls = [item.imageUrl, ...(item.gallery ?? [])].filter(Boolean);

    for (const url of urls) {
      if (seen.has(url) || excludeUrls.has(url)) continue;
      seen.add(url);
      images.push({
        url,
        label: item.title,
        source: "portfolio",
      });
    }
  }

  return images;
}

function useMediaGallery(excludeUrls: string[] = []) {
  const excludeSet = useMemo(() => new Set(excludeUrls), [excludeUrls]);
  const [instagramImages, setInstagramImages] = useState<GalleryImage[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const loadGallery = () => {
    if (loaded || loading) return;

    setLoading(true);
    setError(null);

    Promise.all([
      getInstagramFeed().catch(() => ({ posts: [] })),
      getPortfolioItems().catch(() => []),
    ])
      .then(([feed, portfolio]) => {
        setInstagramImages(
          feed.posts
            .filter((post) => post.imageUrl && !excludeSet.has(post.imageUrl))
            .map((post) => ({
              url: post.imageUrl,
              label: post.caption.slice(0, 60) || "Instagram post",
              source: "instagram" as const,
            }))
        );
        setPortfolioImages(collectPortfolioImages(portfolio, excludeSet));
        setLoaded(true);
      })
      .catch(() => {
        setError("Could not load image gallery.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    instagramImages,
    portfolioImages,
    loading,
    error,
    loaded,
    loadGallery,
  };
}

interface GalleryGridProps {
  images: GalleryImage[];
  selectedUrls?: Set<string>;
  onSelect: (url: string) => void;
  emptyMessage: string;
}

function GalleryGrid({ images, selectedUrls, onSelect, emptyMessage }: GalleryGridProps) {
  if (images.length === 0) {
    return <p className="text-sm text-zinc-500">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {images.map((image) => {
        const selected = selectedUrls?.has(image.url);

        return (
          <button
            key={`${image.source}-${image.url}`}
            type="button"
            onClick={() => onSelect(image.url)}
            className={`group relative aspect-square overflow-hidden rounded-lg border transition ${
              selected
                ? "border-amber-500 ring-2 ring-amber-200"
                : "border-zinc-200 hover:border-amber-300"
            }`}
            title={image.label}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveMediaUrl(image.url)}
              alt={image.label}
              className="h-full w-full object-cover"
            />
            {selected ? (
              <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
                ✓
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

interface GalleryPanelProps {
  tab: "instagram" | "portfolio";
  onTabChange: (tab: "instagram" | "portfolio") => void;
  loading: boolean;
  error: string | null;
  instagramImages: GalleryImage[];
  portfolioImages: GalleryImage[];
  selectedUrls?: Set<string>;
  onSelect: (url: string) => void;
  multiSelect?: boolean;
}

function GalleryPanel({
  tab,
  onTabChange,
  loading,
  error,
  instagramImages,
  portfolioImages,
  selectedUrls,
  onSelect,
  multiSelect = false,
}: GalleryPanelProps) {
  return (
    <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      {multiSelect ? (
        <p className="text-xs text-zinc-500">Click images to add or remove them from the gallery.</p>
      ) : null}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onTabChange("instagram")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            tab === "instagram"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          Instagram
        </button>
        <button
          type="button"
          onClick={() => onTabChange("portfolio")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            tab === "portfolio"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          Portfolio
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading gallery...</p>
      ) : error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : tab === "instagram" ? (
        <GalleryGrid
          images={instagramImages}
          selectedUrls={selectedUrls}
          onSelect={onSelect}
          emptyMessage="No Instagram images available."
        />
      ) : (
        <GalleryGrid
          images={portfolioImages}
          selectedUrls={selectedUrls}
          onSelect={onSelect}
          emptyMessage="No portfolio images yet."
        />
      )}
    </div>
  );
}

interface ImageUrlFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ImageUrlField({
  label,
  value,
  onChange,
  placeholder = "https://your-cdn.com/image.jpg",
}: ImageUrlFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState(value);
  const [showGallery, setShowGallery] = useState(false);
  const [tab, setTab] = useState<"instagram" | "portfolio">("instagram");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { instagramImages, portfolioImages, loading, error, loadGallery } =
    useMediaGallery(value ? [value] : []);

  useEffect(() => {
    setUrlInput(value);
  }, [value]);

  const applyUrl = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      onChange(trimmed);
    }
  };

  const openGallery = () => {
    setShowGallery(true);
    loadGallery();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setUploadError(null);
    setUploading(true);

    try {
      const url = await uploadImage(file);
      onChange(url);
      setUrlInput(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Could not upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium text-zinc-700">{label}</span>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg bg-[#12121a] px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Select image"}
        </button>
        <button
          type="button"
          onClick={() => (showGallery ? setShowGallery(false) : openGallery())}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          {showGallery ? "Hide gallery" : "Choose from gallery"}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onBlur={applyUrl}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyUrl();
            }
          }}
          className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={applyUrl}
          className="shrink-0 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          Use URL
        </button>
      </div>

      {uploadError ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{uploadError}</p>
      ) : null}

      {value ? (
        <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md border border-zinc-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveMediaUrl(value)}
              alt="Selected cover"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-700">Selected image</p>
            <p className="mt-1 truncate text-xs text-zinc-500">{value}</p>
            <button
              type="button"
              onClick={() => onChange("")}
              className="mt-2 text-xs font-medium text-rose-600 hover:text-rose-700"
            >
              Remove
            </button>
          </div>
        </div>
      ) : null}

      {showGallery ? (
        <GalleryPanel
          tab={tab}
          onTabChange={setTab}
          loading={loading}
          error={error}
          instagramImages={instagramImages}
          portfolioImages={portfolioImages}
          onSelect={(url) => {
            onChange(url);
            setUrlInput(url);
            setShowGallery(false);
          }}
        />
      ) : null}
    </div>
  );
}

interface GalleryUrlsFieldProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}

export function GalleryUrlsField({ label, value, onChange }: GalleryUrlsFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [showGallery, setShowGallery] = useState(false);
  const [tab, setTab] = useState<"instagram" | "portfolio">("instagram");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const selectedSet = useMemo(() => new Set(value), [value]);
  const { instagramImages, portfolioImages, loading, error, loadGallery } =
    useMediaGallery(value);

  const addUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
  };

  const removeUrl = (url: string) => {
    onChange(value.filter((item) => item !== url));
  };

  const toggleFromGallery = (url: string) => {
    if (value.includes(url)) {
      removeUrl(url);
    } else {
      addUrl(url);
    }
  };

  const openGallery = () => {
    setShowGallery(true);
    loadGallery();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) return;

    setUploadError(null);
    setUploading(true);

    try {
      const urls = await uploadImages(files);
      const next = [...value];

      for (const url of urls) {
        if (!next.includes(url)) {
          next.push(url);
        }
      }

      onChange(next);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Could not upload images.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium text-zinc-700">{label}</span>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg bg-[#12121a] px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Select images"}
        </button>
        <button
          type="button"
          onClick={() => (showGallery ? setShowGallery(false) : openGallery())}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          {showGallery ? "Hide gallery" : "Add from gallery"}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl(urlInput);
              setUrlInput("");
            }
          }}
          className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
          placeholder="Or paste image URL and press Enter"
        />
        <button
          type="button"
          onClick={() => {
            addUrl(urlInput);
            setUrlInput("");
          }}
          className="shrink-0 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          Add URL
        </button>
      </div>

      {uploadError ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{uploadError}</p>
      ) : null}

      {value.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((url) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveMediaUrl(url)}
                alt="Gallery item"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeUrl(url)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900/75 text-xs text-white opacity-0 transition group-hover:opacity-100"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">No gallery images selected yet.</p>
      )}

      {showGallery ? (
        <GalleryPanel
          tab={tab}
          onTabChange={setTab}
          loading={loading}
          error={error}
          instagramImages={instagramImages}
          portfolioImages={portfolioImages}
          selectedUrls={selectedSet}
          onSelect={toggleFromGallery}
          multiSelect
        />
      ) : null}
    </div>
  );
}
