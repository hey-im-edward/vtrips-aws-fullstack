export type Category = "Hotel" | "Restaurant" | "Attraction" | "Tour";
export type Budget = "Low" | "Medium" | "Premium";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: "traveler" | "business" | "admin";
  city: string;
  avatar: string;
  savedPlaceIds: string[];
}

export interface Place {
  id: string;
  name: string;
  city: string;
  category: Category;
  budget: Budget;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
  description: string;
  owner: string;
  status: "published" | "pending" | "flagged";
  priceFromUsd: number;
  likes: number;
}

export interface TripDay {
  day: number;
  title: string;
  placeIds: string[];
  notes: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  budgetUsd: number;
  visibility: "private" | "public";
  days: TripDay[];
  savedAt: string;
}

export interface Review {
  id: string;
  placeId: string;
  author: string;
  rating: number;
  comment: string;
  helpful: number;
  status: "visible" | "reported" | "hidden";
  createdAt: string;
}

export interface Booking {
  id: string;
  placeId: string;
  tripId?: string;
  guestName: string;
  date: string;
  guests: number;
  status: "requested" | "confirmed" | "cancelled";
  note: string;
}

export interface AiSuggestion {
  mode: string;
  city: string;
  ideas: string[];
  relatedPlaceIds: string[];
}

export interface DashboardSummary {
  [key: string]: string | number | string[];
}
