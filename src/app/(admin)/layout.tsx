import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-zinc-200/80 bg-white/80 px-8 py-5 backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-amber-700/80">
            Events Studio
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
            Booking management
          </h2>
        </header>
        <main className="flex-1 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-50 via-zinc-100 to-zinc-200/50 px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
