import { EnquiriesManager } from "@/components/admin/enquiries-manager";
import { getEnquiries } from "@/lib/api";
import type { EnquiryItem } from "@/lib/types";

export default async function EnquiriesPage() {
  let enquiries: EnquiryItem[] = [];
  let error: string | null = null;

  try {
    enquiries = await getEnquiries();
  } catch {
    error = "Could not load enquiries. Check that the API is running and NEXT_PUBLIC_API_URL is set.";
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <EnquiriesManager enquiries={enquiries} />
      )}
    </div>
  );
}
