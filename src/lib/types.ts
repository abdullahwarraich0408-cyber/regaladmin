export type BookingStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "confirmed"
  | "declined";

export interface Booking {
  id: string;
  createdAt: string;
  status: BookingStatus;
  eventType: string;
  preferredDate: string;
  alternativeDate?: string;
  eventLocation: string;
  area?: string;
  guestCount?: string;
  venueType?: string;
  setupTime?: string;
  theme?: string;
  servicesNeeded?: string[];
  budgetRange?: string;
  inspirationNotes?: string;
  fullName: string;
  email?: string;
  phone?: string;
  preferredContactMethod: string;
  message?: string;
  consent: boolean;
}

export interface BookingsResponse {
  bookings: Booking[];
}

export const BOOKING_STATUSES: BookingStatus[] = [
  "new",
  "contacted",
  "quoted",
  "confirmed",
  "declined",
];

export const STATUS_LABELS: Record<BookingStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  confirmed: "Confirmed",
  declined: "Declined",
};

export type PortfolioCategory = "Weddings" | "Private Events" | "Corporate";

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  category: PortfolioCategory;
  imageUrl: string;
  gallery: string[];
  clientName: string;
  description: string;
  highlights: string[];
  instagramUrl: string;
  palette: [string, string];
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioResponse {
  items: PortfolioItem[];
}

export interface PortfolioInput {
  slug?: string;
  title: string;
  category: PortfolioCategory;
  imageUrl?: string;
  gallery?: string[];
  clientName?: string;
  description?: string;
  highlights?: string[];
  instagramUrl?: string;
  palette?: [string, string];
  published: boolean;
  sortOrder: number;
}

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  "Weddings",
  "Private Events",
  "Corporate",
];

export const DEFAULT_PALETTE: [string, string] = [
  "oklch(0.95 0.03 85)",
  "oklch(0.82 0.08 70)",
];

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  event: string;
  rating: number;
  source: "client" | "google";
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialInput {
  quote: string;
  name: string;
  event: string;
  rating: number;
  source: "client" | "google";
  published: boolean;
  sortOrder: number;
}

export interface EnquiryItem {
  id: string;
  fullName: string;
  phone: string;
  eventType: string;
  eventDate: string;
  source: string;
  status: "new" | "contacted" | "converted" | "declined";
  createdAt: string;
  updatedAt: string;
}

export type EventTypeIcon =
  | "heart"
  | "cake"
  | "baby"
  | "party-popper"
  | "briefcase"
  | "wand-2"
  | "sparkles"
  | "calendar"
  | "star"
  | "flower-2";

export interface EventTypeItem {
  id: string;
  name: string;
  icon: EventTypeIcon;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventTypeInput {
  name: string;
  icon: EventTypeIcon;
  published: boolean;
  sortOrder: number;
}

export const EVENT_TYPE_ICONS: EventTypeIcon[] = [
  "heart",
  "cake",
  "baby",
  "party-popper",
  "briefcase",
  "wand-2",
  "sparkles",
  "calendar",
  "star",
  "flower-2",
];

export type ServiceIcon = EventTypeIcon | "frame" | "utensils";

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  icon: ServiceIcon;
  bestFor: string;
  short: string;
  long: string;
  highlights: string[];
  imageUrl?: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceInput {
  slug?: string;
  title: string;
  icon: ServiceIcon;
  bestFor: string;
  shortDescription: string;
  longDescription: string;
  highlights: string[];
  imageUrl?: string;
  published: boolean;
  sortOrder: number;
}

export const SERVICE_ICONS: ServiceIcon[] = [
  ...EVENT_TYPE_ICONS,
  "frame",
  "utensils",
];

export interface InstagramFeedPost {
  id: string;
  shortcode: string;
  imageUrl: string;
  caption: string;
  url: string;
  isVideo?: boolean;
  isReel?: boolean;
}

export interface InstagramFeedResponse {
  posts: InstagramFeedPost[];
  username?: string;
  stale?: boolean;
  error?: string;
}

export interface InstagramPostItem {
  id: string;
  caption: string;
  imageUrl: string;
  videoUrl: string;
  postUrl: string;
  shortcode: string;
  likes: number;
  isVideo: boolean;
  isReel: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface InstagramPostInput {
  caption: string;
  imageUrl: string;
  videoUrl?: string;
  postUrl?: string;
  shortcode?: string;
  likes?: number;
  isVideo?: boolean;
  isReel?: boolean;
  published: boolean;
  sortOrder: number;
}
