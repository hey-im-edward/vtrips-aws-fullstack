import type { AiSuggestion, Booking, DashboardSummary, Place, Profile, Review, Trip } from "./types";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(apiUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error ?? `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string; service: string }>("/api/health"),
  demoLogin: () => request<{ token: string; authMode: string; user: Profile }>("/api/auth/demo-login", { method: "POST", body: "{}" }),
  profile: () => request<Profile>("/api/profile"),
  places: (params: URLSearchParams) => request<Place[]>(`/api/places?${params.toString()}`),
  createPlace: (payload: Record<string, FormDataEntryValue>) => request<{ place: Place; places: Place[] }>("/api/places", { method: "POST", body: JSON.stringify(payload) }),
  updatePlace: (id: string, payload: Record<string, FormDataEntryValue>) => request<{ place: Place; places: Place[] }>(`/api/places/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  savePlace: (id: string) => request<{ saved: Place[]; places: Place[] }>(`/api/places/${id}/save`, { method: "POST", body: "{}" }),
  saved: () => request<Place[]>("/api/saved"),
  reviews: (placeId: string) => request<Review[]>(`/api/reviews?placeId=${encodeURIComponent(placeId)}`),
  createReview: (payload: Record<string, unknown>) => request<{ review: Review; reviews: Review[]; places: Place[] }>("/api/reviews", { method: "POST", body: JSON.stringify(payload) }),
  trips: () => request<Trip[]>("/api/trips"),
  createTrip: (payload: Record<string, FormDataEntryValue>) => request<{ trip: Trip; trips: Trip[] }>("/api/trips", { method: "POST", body: JSON.stringify(payload) }),
  updateTrip: (id: string, payload: Record<string, FormDataEntryValue>) => request<{ trip: Trip; trips: Trip[] }>(`/api/trips/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  bookings: () => request<Booking[]>("/api/bookings"),
  createBooking: (payload: Record<string, FormDataEntryValue>) => request<{ booking: Booking; bookings: Booking[] }>("/api/bookings", { method: "POST", body: JSON.stringify(payload) }),
  business: () => request<DashboardSummary>("/api/business/summary"),
  admin: () => request<DashboardSummary>("/api/admin/summary"),
  ai: (city: string) => request<AiSuggestion>("/api/ai/suggestions", { method: "POST", body: JSON.stringify({ city }) })
};
