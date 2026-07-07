import { getTestimonials } from "@/lib/api";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";

export default async function TestimonialsPage() {
  const items = await getTestimonials();

  return (
    <div className="space-y-6">
      <TestimonialsManager items={items} />
    </div>
  );
}
