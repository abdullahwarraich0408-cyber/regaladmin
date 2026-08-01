export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  group: "overview" | "leads" | "website";
  icon: string;
};

export const adminNavItems: AdminNavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    description: "Overview of bookings and website activity",
    group: "overview",
    icon: "M4 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6ZM14 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V6ZM4 16a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2ZM14 16a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2Z",
  },
  {
    href: "/bookings",
    label: "Bookings",
    description: "Full booking requests from Plan My Event",
    group: "leads",
    icon: "M8 7V3m8 4V3M4 11h16M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z",
  },
  {
    href: "/enquiries",
    label: "Enquiries",
    description: "Short WhatsApp / quick form leads",
    group: "leads",
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z",
  },
  {
    href: "/event-types",
    label: "Event Types",
    description: "Options shown on the booking form",
    group: "website",
    icon: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z",
  },
  {
    href: "/services",
    label: "Services",
    description: "Weddings, private & corporate pillars",
    group: "website",
    icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
  },
  {
    href: "/portfolio",
    label: "Portfolio",
    description: "Real event stories on the website",
    group: "website",
    icon: "M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z",
  },
  {
    href: "/instagram",
    label: "Instagram",
    description: "Feed shown as social proof",
    group: "website",
    icon: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm6.5-10.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z",
  },
  {
    href: "/testimonials",
    label: "Testimonials",
    description: "Client reviews on the homepage",
    group: "website",
    icon: "M7 8h10M7 12h6m-6 4h8M5 21h14a2 2 0 0 0 2-2V7l-4-4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z",
  },
];

export const navGroups = [
  { id: "overview" as const, label: "Overview" },
  { id: "leads" as const, label: "Leads" },
  { id: "website" as const, label: "Website content" },
];

export function getPageMeta(pathname: string) {
  const exact = adminNavItems.find((item) => item.href === pathname);
  if (exact) {
    return { title: exact.label, description: exact.description };
  }

  const nested = adminNavItems.find(
    (item) => item.href !== "/" && pathname.startsWith(item.href),
  );
  if (nested) {
    return { title: nested.label, description: nested.description };
  }

  return {
    title: "Admin",
    description: "Manage Regal Knot Events website content and leads",
  };
}
