"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateEnquiryStatus } from "@/lib/api";
import type { EnquiryItem } from "@/lib/types";

const statuses: EnquiryItem["status"][] = ["new", "contacted", "converted", "declined"];

const statusStyles: Record<EnquiryItem["status"], string> = {
  new: "bg-sky-50 text-sky-800 ring-sky-100",
  contacted: "bg-soft-gold/20 text-midnight ring-soft-gold/30",
  converted: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  declined: "bg-warm-beige text-muted ring-border",
};

interface EnquiriesManagerProps {
  enquiries: EnquiryItem[];
}

export function EnquiriesManager({ enquiries }: EnquiriesManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onStatusChange = (id: string, status: EnquiryItem["status"]) => {
    startTransition(async () => {
      await updateEnquiryStatus(id, status);
      router.refresh();
    });
  };

  if (enquiries.length === 0) {
    return (
      <div className="admin-card border-dashed p-10 text-center">
        <p className="font-display text-2xl text-midnight">No enquiries yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Quick form leads from the website (and WhatsApp-bound enquiries that also save to the API)
          will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <table className="min-w-full divide-y divide-border text-left text-sm">
        <thead className="bg-warm-beige/50 text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Event</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Received</th>
            <th className="px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">
          {enquiries.map((enquiry) => {
            const wa = `https://wa.me/${enquiry.phone.replace(/\D/g, "")}`;
            return (
              <tr key={enquiry.id} className="hover:bg-warm-beige/30">
                <td className="px-4 py-4 font-medium text-midnight">{enquiry.fullName}</td>
                <td className="px-4 py-4 text-muted">{enquiry.phone}</td>
                <td className="px-4 py-4 text-muted">{enquiry.eventType}</td>
                <td className="px-4 py-4 text-muted">{enquiry.eventDate}</td>
                <td className="px-4 py-4 text-xs text-muted">{enquiry.source}</td>
                <td className="px-4 py-4">
                  <select
                    value={enquiry.status}
                    disabled={isPending}
                    onChange={(event) =>
                      onStatusChange(enquiry.id, event.target.value as EnquiryItem["status"])
                    }
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 outline-none ${statusStyles[enquiry.status]}`}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4 text-muted">
                  {new Date(enquiry.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-4">
                  <a
                    href={wa}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#128C7E] hover:underline"
                  >
                    WhatsApp
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
