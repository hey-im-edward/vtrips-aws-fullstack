import type { Database } from "./types.js";

export const seedDatabase: Database = {
  profile: {
    id: "u-demo",
    name: "Edward Tran",
    email: "traveler@vtrips.demo",
    role: "traveler",
    city: "Ho Chi Minh City",
    avatar: "ET",
    savedPlaceIds: ["place-da-nang-beach", "place-hoi-an-food"]
  },
  places: [
    {
      id: "place-da-nang-beach",
      name: "My Khe Sunrise Walk",
      city: "Da Nang",
      category: "Attraction",
      budget: "Low",
      rating: 4.8,
      reviewCount: 128,
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80",
      tags: ["beach", "sunrise", "photo spot"],
      description: "Morning beach route with cafes, rental bikes, and calm viewpoints for first-time Da Nang visitors.",
      owner: "Da Nang Local Board",
      status: "published",
      priceFromUsd: 0,
      likes: 412
    },
    {
      id: "place-hoi-an-food",
      name: "Hoi An Lantern Food Lane",
      city: "Hoi An",
      category: "Restaurant",
      budget: "Medium",
      rating: 4.7,
      reviewCount: 96,
      image: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=80",
      tags: ["street food", "lantern", "night market"],
      description: "Curated route for cao lau, herbal tea, and lantern photos within a walkable old-town loop.",
      owner: "Lantern Kitchen Collective",
      status: "published",
      priceFromUsd: 12,
      likes: 301
    },
    {
      id: "place-saigon-rooftop",
      name: "Saigon Rooftop Sunset",
      city: "Ho Chi Minh City",
      category: "Tour",
      budget: "Premium",
      rating: 4.6,
      reviewCount: 74,
      image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=80",
      tags: ["skyline", "local guide", "evening"],
      description: "A light guided evening plan connecting coffee, architecture, sunset skyline, and late-night snacks.",
      owner: "V-Trips Curators",
      status: "published",
      priceFromUsd: 38,
      likes: 189
    },
    {
      id: "place-da-lat-stay",
      name: "Da Lat Pine Garden Stay",
      city: "Da Lat",
      category: "Hotel",
      budget: "Medium",
      rating: 4.5,
      reviewCount: 63,
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      tags: ["homestay", "pine forest", "couples"],
      description: "Quiet garden stay with motorbike-friendly access to coffee farms, night market, and cloud-hunting routes.",
      owner: "Pine Garden Homestay",
      status: "pending",
      priceFromUsd: 27,
      likes: 144
    }
  ],
  trips: [
    {
      id: "trip-central-vietnam",
      title: "3 Days Da Nang to Hoi An",
      destination: "Da Nang / Hoi An",
      budgetUsd: 180,
      visibility: "public",
      savedAt: "2026-07-08",
      days: [
        {
          day: 1,
          title: "Beach arrival",
          placeIds: ["place-da-nang-beach"],
          notes: "Sunrise walk, seafood lunch, light cafe hop."
        },
        {
          day: 2,
          title: "Old town food route",
          placeIds: ["place-hoi-an-food"],
          notes: "Lantern walk, cao lau dinner, night market review stop."
        }
      ]
    }
  ],
  reviews: [
    {
      id: "review-1",
      placeId: "place-da-nang-beach",
      author: "Minh Anh",
      rating: 5,
      comment: "Easy route for a first morning in Da Nang. The save/export flow is useful for group planning.",
      helpful: 18,
      status: "visible",
      createdAt: "2026-07-01"
    },
    {
      id: "review-2",
      placeId: "place-hoi-an-food",
      author: "Linh Pham",
      rating: 4,
      comment: "Good food choices and realistic walking distance. Add more vegetarian notes later.",
      helpful: 9,
      status: "visible",
      createdAt: "2026-07-04"
    }
  ],
  bookings: [
    {
      id: "booking-1",
      placeId: "place-saigon-rooftop",
      tripId: "trip-central-vietnam",
      guestName: "Edward Tran",
      date: "2026-07-20",
      guests: 2,
      status: "requested",
      note: "Need a sunset slot and invoice note for demo submission."
    }
  ]
};
