import { ServicesManager } from "@/components/admin/services-manager";
import { getServices } from "@/lib/api";
import type { ServiceItem } from "@/lib/types";

export default async function ServicesPage() {
  let items: ServiceItem[] = [];
  let error: string | null = null;

  try {
    items = await getServices();
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
        <ServicesManager items={items} />
      )}
    </div>
  );
}
