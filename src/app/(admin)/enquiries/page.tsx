import { getEnquiries } from "@/lib/api";

const statusColors: Record<string, string> = {
  new: "bg-sky-100 text-sky-800",
  contacted: "bg-amber-100 text-amber-800",
  converted: "bg-emerald-100 text-emerald-800",
  declined: "bg-zinc-100 text-zinc-600",
};

export default async function EnquiriesPage() {
  const enquiries = await getEnquiries();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">Quick Enquiries</h2>
        <p className="text-sm text-zinc-500">
          Short-form leads from the homepage and conversion sections.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Name</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Phone</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Event</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Date</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                  No enquiries yet — they will appear here when visitors submit the quick form.
                </td>
              </tr>
            ) : (
              enquiries.map((enquiry) => (
                <tr key={enquiry.id}>
                  <td className="px-4 py-3 font-medium text-zinc-900">{enquiry.fullName}</td>
                  <td className="px-4 py-3">{enquiry.phone}</td>
                  <td className="px-4 py-3">{enquiry.eventType}</td>
                  <td className="px-4 py-3">{enquiry.eventDate}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[enquiry.status]}`}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(enquiry.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
