// types/index.ts

export type UserRole = "guest" | "user" | "admin";
export type ListingStatus = "pending" | "active" | "sold" | "rejected";
export type MarketScore = "good_deal" | "fair_price" | "overpriced";
export type TransmissionType = "automatic" | "manual";
export type DriveType = "2WD" | "4WD" | "AWD";
export type FuelType = "petrol" | "diesel" | "hybrid" | "electric";
export type InquiryStatus = "new" | "read" | "responded";

// ── Profile ──────────────────────────────────────────────────
export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// ── Car Image ─────────────────────────────────────────────────
export interface CarImage {
  id: string;
  listing_id: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

// ── Car Listing ───────────────────────────────────────────────
export interface CarListing {
  id: string;
  seller_id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engine_size: number | null;
  transmission: TransmissionType;
  fuel_type: FuelType;
  drive_type: DriveType;
  color: string | null;
  body_type: string | null;
  condition: string;
  description: string | null;
  location: string;
  market_score: MarketScore | null;
  status: ListingStatus;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  car_images?: CarImage[];
  profiles?: Pick<Profile, "id" | "full_name" | "phone">;
}

// ── Listing with primary image ─────────────────────────────────
export interface CarListingCard extends CarListing {
  primary_image: string | null;
}

// ── Inquiry ───────────────────────────────────────────────────
export interface Inquiry {
  id: string;
  listing_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  status: InquiryStatus;
  created_at: string;
  // Joined
  car_listings?: Pick<CarListing, "id" | "title" | "make" | "model" | "year">;
}

// ── Article ───────────────────────────────────────────────────
export interface Article {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// ── Saved Car ─────────────────────────────────────────────────
export interface SavedCar {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  car_listings?: CarListingCard;
}

// ── Market Price Reference ─────────────────────────────────────
export interface MarketPriceReference {
  id: string;
  make: string;
  model: string;
  year_min: number;
  year_max: number;
  fair_price_min: number;
  fair_price_max: number;
}

// ── API Response wrapper ──────────────────────────────────────
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// ── Filters ───────────────────────────────────────────────────
export interface ListingFilters {
  search?: string;
  make?: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  transmission?: TransmissionType | "";
  fuel_type?: FuelType | "";
  body_type?: string;
  market_score?: MarketScore | "";
  sort?: "price_asc" | "price_desc" | "newest" | "oldest" | "mileage_asc";
  page?: number;
  limit?: number;
}

// ── Dashboard stats ───────────────────────────────────────────
export interface SellerStats {
  total_listings: number;
  active_listings: number;
  pending_listings: number;
  sold_listings: number;
  total_inquiries: number;
  new_inquiries: number;
}

export interface AdminStats extends SellerStats {
  total_users: number;
  total_revenue_est: number;
}

// ── Comparison ────────────────────────────────────────────────
export interface ComparisonSpec {
  label: string;
  key: keyof CarListing;
  format?: "currency" | "km" | "year" | "text";
}
