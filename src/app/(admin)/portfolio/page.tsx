import { PortfolioManager } from "@/components/admin/portfolio-manager";
import { getPortfolioItems } from "@/lib/api";
import type { PortfolioItem } from "@/lib/types";

export default async function PortfolioPage() {
  let items: PortfolioItem[] = [];
  let error: string | null = null;

  try {
    items = await getPortfolioItems();
  } catch {
    error =
      "Could not reach the backend API. Start it with `npm run dev` in the backend folder.";
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <PortfolioManager items={items} />
      )}
    </div>
  );
}
