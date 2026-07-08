export type UserRole = "traveler" | "business" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  city: string;
  avatar: string;
  savedPlaceIds: string[];
}

export interface Place {
  id: string;
  name: string;
  city: string;
  category: "Hotel" | "Restaurant" | "Attraction" | "Tour";
  budget: "Low" | "Medium" | "Premium";
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

export interface Database {
  profile: UserProfile;
  places: Place[];
  trips: Trip[];
  reviews: Review[];
  bookings: Booking[];
}
