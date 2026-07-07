import { EventTypesManager } from "@/components/admin/event-types-manager";
import { getEventTypes } from "@/lib/api";
import type { EventTypeItem } from "@/lib/types";

export default async function EventTypesPage() {
  let items: EventTypeItem[] = [];
  let error: string | null = null;

  try {
    items = await getEventTypes();
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
        <EventTypesManager items={items} />
      )}
    </div>
  );
}
