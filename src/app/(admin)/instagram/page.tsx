import { getInstagramPosts } from "@/lib/api";
import { InstagramManager } from "@/components/admin/instagram-manager";

export default async function InstagramPage() {
  let items: Awaited<ReturnType<typeof getInstagramPosts>> = [];
  let loadError: string | null = null;

  try {
    items = await getInstagramPosts();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Failed to load Instagram posts. Is the Node backend running with the latest code?";
  }

  return (
    <div className="space-y-6">
      {loadError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
          <p className="mt-1 text-amber-800/80">
            Start the Node backend locally (`backend` folder → `npm run dev`) and set
            `NEXT_PUBLIC_API_URL=http://localhost:3001`, or deploy the updated backend to
            your live API.
          </p>
        </div>
      ) : null}
      <InstagramManager items={items} />
    </div>
  );
}
