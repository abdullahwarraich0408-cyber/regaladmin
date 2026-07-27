import type {
  Booking,
  BookingsResponse,
  EnquiryItem,
  EventTypeInput,
  EventTypeItem,
  PortfolioInput,
  PortfolioItem,
  PortfolioResponse,
  ServiceInput,
  ServiceItem,
  TestimonialInput,
  TestimonialItem,
  InstagramFeedResponse,
  InstagramPostInput,
  InstagramPostItem,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function getBookings(): Promise<Booking[]> {
  const response = await fetch(`${API_URL}/api/bookings`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load bookings");
  }

  const data = (await response.json()) as BookingsResponse;
  return data.bookings;
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"]
): Promise<Booking> {
  const response = await fetch(`${API_URL}/api/bookings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update booking status");
  }

  const data = (await response.json()) as { booking: Booking };
  return data.booking;
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const response = await fetch(`${API_URL}/api/portfolio`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load portfolio items");
  }

  const data = (await response.json()) as PortfolioResponse;
  return data.items;
}

export async function createPortfolioItem(
  input: PortfolioInput
): Promise<PortfolioItem> {
  const response = await fetch(`${API_URL}/api/portfolio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to create portfolio item");
  }

  const data = (await response.json()) as { item: PortfolioItem };
  return data.item;
}

export async function updatePortfolioItem(
  id: string,
  input: Partial<PortfolioInput>
): Promise<PortfolioItem> {
  const response = await fetch(`${API_URL}/api/portfolio/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to update portfolio item");
  }

  const data = (await response.json()) as { item: PortfolioItem };
  return data.item;
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/portfolio/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete portfolio item");
  }
}

export async function seedDemoPortfolio(): Promise<PortfolioItem[]> {
  const response = await fetch(`${API_URL}/api/portfolio/demo`, {
    method: "POST",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to load demo portfolio data");
  }

  const data = (await response.json()) as { items: PortfolioItem[] };
  return data.items;
}

export async function clearAllPortfolio(): Promise<void> {
  const response = await fetch(`${API_URL}/api/portfolio/all`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to clear portfolio items");
  }
}

export async function importPortfolioFromInstagram(
  limit = 6
): Promise<PortfolioItem[]> {
  const response = await fetch(`${API_URL}/api/portfolio/import-instagram`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limit }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to import from Instagram");
  }

  const data = (await response.json()) as { items: PortfolioItem[] };
  return data.items;
}

export async function getEventTypes(): Promise<EventTypeItem[]> {
  const response = await fetch(`${API_URL}/api/event-types`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load event types");
  }

  const data = (await response.json()) as { items: EventTypeItem[] };
  return data.items;
}

export async function createEventType(input: EventTypeInput): Promise<EventTypeItem> {
  const response = await fetch(`${API_URL}/api/event-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to create event type");
  }

  const data = (await response.json()) as { item: EventTypeItem };
  return data.item;
}

export async function updateEventType(
  id: string,
  input: Partial<EventTypeInput>
): Promise<EventTypeItem> {
  const response = await fetch(`${API_URL}/api/event-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to update event type");
  }

  const data = (await response.json()) as { item: EventTypeItem };
  return data.item;
}

export async function deleteEventType(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/event-types/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete event type");
  }
}

export async function seedDemoEventTypes(): Promise<EventTypeItem[]> {
  const response = await fetch(`${API_URL}/api/event-types/demo`, {
    method: "POST",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to load demo event types");
  }

  const data = (await response.json()) as { items: EventTypeItem[] };
  return data.items;
}

export async function clearAllEventTypes(): Promise<void> {
  const response = await fetch(`${API_URL}/api/event-types/all`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to clear event types");
  }
}

export async function getServices(): Promise<ServiceItem[]> {
  const response = await fetch(`${API_URL}/api/services`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load services");
  }

  const data = (await response.json()) as { items: ServiceItem[] };
  return data.items;
}

export async function createService(input: ServiceInput): Promise<ServiceItem> {
  const response = await fetch(`${API_URL}/api/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to create service");
  }

  const data = (await response.json()) as { item: ServiceItem };
  return data.item;
}

export async function updateService(
  id: string,
  input: Partial<ServiceInput>
): Promise<ServiceItem> {
  const response = await fetch(`${API_URL}/api/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to update service");
  }

  const data = (await response.json()) as { item: ServiceItem };
  return data.item;
}

export async function deleteService(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/services/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete service");
  }
}

export async function seedDemoServices(): Promise<ServiceItem[]> {
  const response = await fetch(`${API_URL}/api/services/demo`, {
    method: "POST",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to load demo services");
  }

  const data = (await response.json()) as { items: ServiceItem[] };
  return data.items;
}

export async function clearAllServices(): Promise<void> {
  const response = await fetch(`${API_URL}/api/services/all`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to clear services");
  }
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  const response = await fetch(`${API_URL}/api/testimonials`, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to load testimonials");
  const data = (await response.json()) as { items: TestimonialItem[] };
  return data.items;
}

export async function createTestimonial(input: TestimonialInput): Promise<TestimonialItem> {
  const response = await fetch(`${API_URL}/api/testimonials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Failed to create testimonial");
  const data = (await response.json()) as { item: TestimonialItem };
  return data.item;
}

export async function updateTestimonial(
  id: string,
  input: Partial<TestimonialInput>
): Promise<TestimonialItem> {
  const response = await fetch(`${API_URL}/api/testimonials/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Failed to update testimonial");
  const data = (await response.json()) as { item: TestimonialItem };
  return data.item;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/testimonials/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete testimonial");
}

export async function seedDemoTestimonials(): Promise<TestimonialItem[]> {
  const response = await fetch(`${API_URL}/api/testimonials/demo`, { method: "POST" });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to load demo testimonials");
  }
  const data = (await response.json()) as { items: TestimonialItem[] };
  return data.items;
}

export async function getInstagramFeed(): Promise<InstagramFeedResponse> {
  const response = await fetch(`${API_URL}/api/instagram/feed`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to load Instagram gallery");
  }

  return (await response.json()) as InstagramFeedResponse;
}

export async function getInstagramPosts(): Promise<InstagramPostItem[]> {
  const response = await fetch(`${API_URL}/api/instagram-posts`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to load Instagram posts");
  const data = (await response.json()) as { items: InstagramPostItem[] };
  return data.items;
}

export async function createInstagramPost(
  input: InstagramPostInput
): Promise<InstagramPostItem> {
  const response = await fetch(`${API_URL}/api/instagram-posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Failed to create Instagram post");
  const data = (await response.json()) as { item: InstagramPostItem };
  return data.item;
}

export async function updateInstagramPost(
  id: string,
  input: Partial<InstagramPostInput>
): Promise<InstagramPostItem> {
  const response = await fetch(`${API_URL}/api/instagram-posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Failed to update Instagram post");
  const data = (await response.json()) as { item: InstagramPostItem };
  return data.item;
}

export async function deleteInstagramPost(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/instagram-posts/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete Instagram post");
}

export async function seedDemoInstagramPosts(): Promise<InstagramPostItem[]> {
  const response = await fetch(`${API_URL}/api/instagram-posts/demo`, {
    method: "POST",
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to load demo Instagram posts");
  }
  const data = (await response.json()) as { items: InstagramPostItem[] };
  return data.items;
}

export async function clearAllInstagramPosts(): Promise<void> {
  const response = await fetch(`${API_URL}/api/instagram-posts/all`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to clear Instagram posts");
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/uploads`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to upload image");
  }

  const data = (await response.json()) as { url: string };
  return data.url;
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch(`${API_URL}/api/uploads/batch`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Failed to upload images");
  }

  const data = (await response.json()) as { urls: string[] };
  return data.urls;
}

export async function getEnquiries(): Promise<EnquiryItem[]> {
  const response = await fetch(`${API_URL}/api/enquiries`, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to load enquiries");
  const data = (await response.json()) as { enquiries: EnquiryItem[] };
  return data.enquiries;
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryItem["status"]
): Promise<EnquiryItem> {
  const response = await fetch(`${API_URL}/api/enquiries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update enquiry status");
  const data = (await response.json()) as { enquiry: EnquiryItem };
  return data.enquiry;
}
