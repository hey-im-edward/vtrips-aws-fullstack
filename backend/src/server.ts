import http from "node:http";
import { URL } from "node:url";
import { newId, readDb, writeDb } from "./store.js";
import type { Booking, Place, Review, Trip } from "./types.js";

const PORT = Number(process.env.PORT ?? 8787);

type JsonValue = Record<string, unknown> | unknown[];

function sendJson(res: http.ServerResponse, status: number, payload: unknown): void {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, OPTIONS"
  });
  res.end(JSON.stringify(payload));
}

function sendHtml(res: http.ServerResponse, html: string): void {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(html);
}

function getBody(req: http.IncomingMessage): Promise<JsonValue> {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw) as JsonValue);
      } catch {
        reject(new Error("Invalid JSON payload"));
      }
    });
  });
}

function asRecord(value: JsonValue): Record<string, unknown> {
  if (!value || Array.isArray(value) || typeof value !== "object") {
    return {};
  }
  return value;
}

function requiredString(body: Record<string, unknown>, field: string): string {
  const value = body[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }
  return value.trim();
}

function optionalNumber(body: Record<string, unknown>, field: string, fallback: number): number {
  const value = body[field];
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return fallback;
}

function matchesSearch(place: Place, search: string): boolean {
  if (!search) {
    return true;
  }
  const haystack = `${place.name} ${place.city} ${place.category} ${place.tags.join(" ")} ${place.description}`.toLowerCase();
  return haystack.includes(search.toLowerCase());
}

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  if (!req.url) {
    sendJson(res, 400, { error: "Missing URL" });
    return;
  }

  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);
  const parts = url.pathname.split("/").filter(Boolean);

  if (url.pathname === "/api/health" && req.method === "GET") {
    sendJson(res, 200, {
      status: "ok",
      service: "vtrips-backend",
      awsTarget: ["S3", "CloudFront", "API Gateway", "Lambda", "DynamoDB", "Cognito", "CloudWatch", "IAM"]
    });
    return;
  }

  if (url.pathname === "/api/auth/demo-login" && req.method === "POST") {
    const db = await readDb();
    sendJson(res, 200, {
      token: "demo-token-cognito-ready",
      authMode: "demo-auth",
      user: db.profile
    });
    return;
  }

  if (url.pathname === "/api/profile" && req.method === "GET") {
    const db = await readDb();
    sendJson(res, 200, db.profile);
    return;
  }

  if (url.pathname === "/api/profile" && req.method === "PATCH") {
    const body = asRecord(await getBody(req));
    const db = await writeDb((draft) => {
      draft.profile.name = typeof body.name === "string" ? body.name : draft.profile.name;
      draft.profile.city = typeof body.city === "string" ? body.city : draft.profile.city;
      draft.profile.role = body.role === "business" || body.role === "admin" || body.role === "traveler" ? body.role : draft.profile.role;
    });
    sendJson(res, 200, db.profile);
    return;
  }

  if (url.pathname === "/api/places" && req.method === "GET") {
    const db = await readDb();
    const search = url.searchParams.get("search") ?? "";
    const category = url.searchParams.get("category") ?? "All";
    const budget = url.searchParams.get("budget") ?? "All";
    const places = db.places.filter((place) => {
      return matchesSearch(place, search)
        && (category === "All" || place.category === category)
        && (budget === "All" || place.budget === budget);
    });
    sendJson(res, 200, places);
    return;
  }

  if (url.pathname === "/api/places" && req.method === "POST") {
    const body = asRecord(await getBody(req));
    const place: Place = {
      id: newId("place"),
      name: requiredString(body, "name"),
      city: requiredString(body, "city"),
      category: body.category === "Hotel" || body.category === "Restaurant" || body.category === "Tour" ? body.category : "Attraction",
      budget: body.budget === "Low" || body.budget === "Premium" ? body.budget : "Medium",
      rating: 4.4,
      reviewCount: 0,
      image: typeof body.image === "string" && body.image ? body.image : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
      tags: typeof body.tags === "string" ? body.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : ["community"],
      description: requiredString(body, "description"),
      owner: typeof body.owner === "string" && body.owner ? body.owner : "Community submission",
      status: "pending",
      priceFromUsd: optionalNumber(body, "priceFromUsd", 10),
      likes: 0
    };
    const db = await writeDb((draft) => {
      draft.places.unshift(place);
    });
    sendJson(res, 201, { place, places: db.places });
    return;
  }

  if (parts[0] === "api" && parts[1] === "places" && parts[2] && !parts[3] && req.method === "GET") {
    const db = await readDb();
    const place = db.places.find((item) => item.id === parts[2]);
    if (!place) {
      sendJson(res, 404, { error: "Place not found" });
      return;
    }
    sendJson(res, 200, place);
    return;
  }

  if (parts[0] === "api" && parts[1] === "places" && parts[2] && !parts[3] && req.method === "PUT") {
    const body = asRecord(await getBody(req));
    let updated: Place | undefined;
    const db = await writeDb((draft) => {
      const place = draft.places.find((item) => item.id === parts[2]);
      if (!place) {
        return;
      }
      place.name = typeof body.name === "string" && body.name ? body.name : place.name;
      place.city = typeof body.city === "string" && body.city ? body.city : place.city;
      place.description = typeof body.description === "string" && body.description ? body.description : place.description;
      place.priceFromUsd = optionalNumber(body, "priceFromUsd", place.priceFromUsd);
      updated = place;
    });
    if (!updated) {
      sendJson(res, 404, { error: "Place not found" });
      return;
    }
    sendJson(res, 200, { place: updated, places: db.places });
    return;
  }

  if (parts[0] === "api" && parts[1] === "places" && parts[3] === "save" && req.method === "POST") {
    const db = await writeDb((draft) => {
      const place = draft.places.find((item) => item.id === parts[2]);
      if (place) {
        place.likes += 1;
      }
      if (parts[2] && !draft.profile.savedPlaceIds.includes(parts[2])) {
        draft.profile.savedPlaceIds.push(parts[2]);
      }
    });
    sendJson(res, 200, {
      saved: db.places.filter((place) => db.profile.savedPlaceIds.includes(place.id)),
      places: db.places
    });
    return;
  }

  if (url.pathname === "/api/saved" && req.method === "GET") {
    const db = await readDb();
    sendJson(res, 200, db.places.filter((place) => db.profile.savedPlaceIds.includes(place.id)));
    return;
  }

  if (url.pathname === "/api/reviews" && req.method === "GET") {
    const db = await readDb();
    const placeId = url.searchParams.get("placeId");
    sendJson(res, 200, placeId ? db.reviews.filter((review) => review.placeId === placeId) : db.reviews);
    return;
  }

  if (url.pathname === "/api/reviews" && req.method === "POST") {
    const body = asRecord(await getBody(req));
    const rating = Math.min(5, Math.max(1, optionalNumber(body, "rating", 5)));
    const review: Review = {
      id: newId("review"),
      placeId: requiredString(body, "placeId"),
      author: typeof body.author === "string" && body.author ? body.author : "Demo traveler",
      rating,
      comment: requiredString(body, "comment"),
      helpful: 0,
      status: "visible",
      createdAt: new Date().toISOString().slice(0, 10)
    };
    const db = await writeDb((draft) => {
      draft.reviews.unshift(review);
      const place = draft.places.find((item) => item.id === review.placeId);
      if (place) {
        const reviews = draft.reviews.filter((item) => item.placeId === place.id);
        place.reviewCount = reviews.length;
        place.rating = Number((reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1));
      }
    });
    sendJson(res, 201, { review, reviews: db.reviews, places: db.places });
    return;
  }

  if (url.pathname === "/api/trips" && req.method === "GET") {
    const db = await readDb();
    sendJson(res, 200, db.trips);
    return;
  }

  if (url.pathname === "/api/trips" && req.method === "POST") {
    const body = asRecord(await getBody(req));
    const trip: Trip = {
      id: newId("trip"),
      title: requiredString(body, "title"),
      destination: requiredString(body, "destination"),
      budgetUsd: optionalNumber(body, "budgetUsd", 220),
      visibility: body.visibility === "public" ? "public" : "private",
      savedAt: new Date().toISOString().slice(0, 10),
      days: [
        {
          day: 1,
          title: "Arrival and highlights",
          placeIds: typeof body.placeId === "string" ? [body.placeId] : [],
          notes: typeof body.notes === "string" && body.notes ? body.notes : "Start with saved places, reviews, and one booking request."
        }
      ]
    };
    const db = await writeDb((draft) => {
      draft.trips.unshift(trip);
    });
    sendJson(res, 201, { trip, trips: db.trips });
    return;
  }

  if (parts[0] === "api" && parts[1] === "trips" && parts[2] && !parts[3] && req.method === "GET") {
    const db = await readDb();
    const trip = db.trips.find((item) => item.id === parts[2]);
    if (!trip) {
      sendJson(res, 404, { error: "Trip not found" });
      return;
    }
    sendJson(res, 200, trip);
    return;
  }

  if (parts[0] === "api" && parts[1] === "trips" && parts[2] && !parts[3] && req.method === "PUT") {
    const body = asRecord(await getBody(req));
    let updated: Trip | undefined;
    const db = await writeDb((draft) => {
      const trip = draft.trips.find((item) => item.id === parts[2]);
      if (!trip) {
        return;
      }
      trip.title = typeof body.title === "string" && body.title ? body.title : trip.title;
      trip.destination = typeof body.destination === "string" && body.destination ? body.destination : trip.destination;
      trip.budgetUsd = optionalNumber(body, "budgetUsd", trip.budgetUsd);
      updated = trip;
    });
    if (!updated) {
      sendJson(res, 404, { error: "Trip not found" });
      return;
    }
    sendJson(res, 200, { trip: updated, trips: db.trips });
    return;
  }

  if (url.pathname === "/api/bookings" && req.method === "GET") {
    const db = await readDb();
    sendJson(res, 200, db.bookings);
    return;
  }

  if (url.pathname === "/api/bookings" && req.method === "POST") {
    const body = asRecord(await getBody(req));
    const booking: Booking = {
      id: newId("booking"),
      placeId: requiredString(body, "placeId"),
      tripId: typeof body.tripId === "string" ? body.tripId : undefined,
      guestName: requiredString(body, "guestName"),
      date: requiredString(body, "date"),
      guests: optionalNumber(body, "guests", 1),
      status: "requested",
      note: typeof body.note === "string" ? body.note : ""
    };
    const db = await writeDb((draft) => {
      draft.bookings.unshift(booking);
    });
    sendJson(res, 201, { booking, bookings: db.bookings });
    return;
  }

  if (url.pathname === "/api/business/summary" && req.method === "GET") {
    const db = await readDb();
    sendJson(res, 200, {
      ownedListings: db.places.filter((place) => place.owner !== "Community submission").length,
      pendingListings: db.places.filter((place) => place.status === "pending").length,
      bookingRequests: db.bookings.filter((booking) => booking.status === "requested").length,
      averageRating: Number((db.places.reduce((sum, place) => sum + place.rating, 0) / db.places.length).toFixed(1))
    });
    return;
  }

  if (url.pathname === "/api/admin/summary" && req.method === "GET") {
    const db = await readDb();
    sendJson(res, 200, {
      users: 38,
      places: db.places.length,
      reportedReviews: db.reviews.filter((review) => review.status === "reported").length,
      pendingListings: db.places.filter((place) => place.status === "pending").length,
      awsReadiness: ["CloudFront", "API Gateway", "Lambda", "DynamoDB", "Cognito-ready"]
    });
    return;
  }

  if (url.pathname === "/api/ai/suggestions" && req.method === "POST") {
    const body = asRecord(await getBody(req));
    const city = typeof body.city === "string" && body.city ? body.city : "Da Nang";
    const db = await readDb();
    const related = db.places.filter((place) => place.city.toLowerCase().includes(city.toLowerCase()) || place.tags.some((tag) => tag.includes("beach"))).slice(0, 3);
    sendJson(res, 200, {
      mode: "rule-based-fallback",
      city,
      ideas: [
        `Start with ${related[0]?.name ?? "a saved place"} for low-risk demo flow.`,
        "Add one review stop and one booking request so the fullstack slices are visible.",
        "Use CloudFront default HTTPS domain for the submission demo unless a custom domain is already ready."
      ],
      relatedPlaceIds: related.map((place) => place.id)
    });
    return;
  }

  if (parts[0] === "api" && parts[1] === "export" && parts[2] === "trips" && parts[3] && req.method === "GET") {
    const db = await readDb();
    const trip = db.trips.find((item) => item.id === parts[3]);
    if (!trip) {
      sendJson(res, 404, { error: "Trip not found" });
      return;
    }
    const rows = trip.days.map((day) => `<li><strong>Day ${day.day}: ${day.title}</strong><br>${day.notes}</li>`).join("");
    sendHtml(res, `<!doctype html><html><head><title>${trip.title}</title><style>body{font-family:Inter,Arial,sans-serif;max-width:760px;margin:48px auto;color:#123}h1{color:#075985}.meta{color:#64748b}li{margin:14px 0}@media print{button{display:none}}</style></head><body><h1>${trip.title}</h1><p class="meta">${trip.destination} · Budget $${trip.budgetUsd} · ${trip.visibility}</p><ul>${rows}</ul><p>Generated by V-Trips demo export. Use browser Print → Save as PDF.</p><button onclick="window.print()">Print / Save PDF</button></body></html>`);
    return;
  }

  sendJson(res, 404, { error: `No route for ${req.method} ${url.pathname}` });
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown server error";
    sendJson(res, 400, { error: message });
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`V-Trips API running at http://127.0.0.1:${PORT}`);
});
