const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type, authorization",
  "access-control-allow-methods": "GET, POST, PUT, PATCH, OPTIONS"
};

const seedDatabase = {
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
        { day: 1, title: "Beach arrival", placeIds: ["place-da-nang-beach"], notes: "Sunrise walk, seafood lunch, light cafe hop." },
        { day: 2, title: "Old town food route", placeIds: ["place-hoi-an-food"], notes: "Lantern walk, cao lau dinner, night market review stop." }
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

let dynamoModules;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function response(statusCode, body, headers = jsonHeaders) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

function htmlResponse(html) {
  return {
    statusCode: 200,
    headers: { "content-type": "text/html; charset=utf-8", "access-control-allow-origin": "*" },
    body: html
  };
}

function newId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function requiredString(body, field) {
  const value = body[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }
  return value.trim();
}

function optionalNumber(body, field, fallback) {
  const value = body[field];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && Number.isFinite(Number(value))) return Number(value);
  return fallback;
}

function parseBody(event) {
  if (!event.body) return {};
  const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
  return JSON.parse(raw);
}

function getUrl(event) {
  const rawPath = event.rawPath ?? event.path ?? "/";
  const rawQuery = event.rawQueryString ? `?${event.rawQueryString}` : "";
  return new URL(`${rawPath}${rawQuery}`, "https://vtrips.demo");
}

function getMethod(event) {
  return event.requestContext?.http?.method ?? event.httpMethod ?? "GET";
}

function matchesSearch(place, search) {
  if (!search) return true;
  const haystack = `${place.name} ${place.city} ${place.category} ${place.tags.join(" ")} ${place.description}`.toLowerCase();
  return haystack.includes(search.toLowerCase());
}

async function getDynamoModules() {
  if (!dynamoModules) {
    dynamoModules = await import("@aws-sdk/client-dynamodb");
  }
  return dynamoModules;
}

async function getDynamoClient() {
  const { DynamoDBClient } = await getDynamoModules();
  return new DynamoDBClient({});
}

function entityItem(entityType, id, data) {
  return {
    PutRequest: {
      Item: {
        PK: { S: `${entityType}#${id}` },
        SK: { S: "ENTITY" },
        EntityType: { S: entityType },
        EntityId: { S: id },
        Data: { S: JSON.stringify(data) }
      }
    }
  };
}

function toItems(db) {
  return [
    entityItem("PROFILE", db.profile.id, db.profile),
    ...db.places.map((item) => entityItem("PLACE", item.id, item)),
    ...db.trips.map((item) => entityItem("TRIP", item.id, item)),
    ...db.reviews.map((item) => entityItem("REVIEW", item.id, item)),
    ...db.bookings.map((item) => entityItem("BOOKING", item.id, item))
  ];
}

async function saveDynamoDb(db) {
  const tableName = process.env.VTRIPS_TABLE_NAME;
  if (!tableName) throw new Error("VTRIPS_TABLE_NAME is required");
  const { BatchWriteItemCommand } = await getDynamoModules();
  const client = await getDynamoClient();
  const items = toItems(db);
  for (let index = 0; index < items.length; index += 25) {
    const chunk = items.slice(index, index + 25);
    await client.send(new BatchWriteItemCommand({ RequestItems: { [tableName]: chunk } }));
  }
}

async function loadDynamoDb() {
  const tableName = process.env.VTRIPS_TABLE_NAME;
  if (!tableName) throw new Error("VTRIPS_TABLE_NAME is required");
  const { ScanCommand } = await getDynamoModules();
  const client = await getDynamoClient();
  const result = await client.send(new ScanCommand({ TableName: tableName }));
  if (!result.Items || result.Items.length === 0) {
    const seeded = clone(seedDatabase);
    await saveDynamoDb(seeded);
    return seeded;
  }
  const db = { profile: undefined, places: [], trips: [], reviews: [], bookings: [] };
  for (const item of result.Items) {
    const entityType = item.EntityType?.S;
    const data = JSON.parse(item.Data?.S ?? "{}");
    if (entityType === "PROFILE") db.profile = data;
    if (entityType === "PLACE") db.places.push(data);
    if (entityType === "TRIP") db.trips.push(data);
    if (entityType === "REVIEW") db.reviews.push(data);
    if (entityType === "BOOKING") db.bookings.push(data);
  }
  db.profile ??= clone(seedDatabase.profile);
  return db;
}

async function loadDb() {
  if (process.env.VTRIPS_TEST_MODE === "memory") {
    globalThis.__vtripsMemoryDb ??= clone(seedDatabase);
    return globalThis.__vtripsMemoryDb;
  }
  return loadDynamoDb();
}

async function saveDb(db) {
  if (process.env.VTRIPS_TEST_MODE === "memory") {
    globalThis.__vtripsMemoryDb = db;
    return;
  }
  await saveDynamoDb(db);
}

async function mutateDb(updater) {
  const db = await loadDb();
  updater(db);
  await saveDb(db);
  return db;
}

async function route(event) {
  const method = getMethod(event);
  if (method === "OPTIONS") return response(204, {});

  const url = getUrl(event);
  const parts = url.pathname.split("/").filter(Boolean);

  if (url.pathname === "/api/health" && method === "GET") {
    return response(200, {
      status: "ok",
      service: "vtrips-lambda",
      runtime: "nodejs22.x",
      awsTarget: ["S3", "CloudFront", "API Gateway", "Lambda", "DynamoDB", "CloudWatch", "IAM"]
    });
  }

  if (url.pathname === "/api/auth/demo-login" && method === "POST") {
    const db = await loadDb();
    return response(200, { token: "demo-token-cost-safe", authMode: "demo-auth", user: db.profile });
  }

  if (url.pathname === "/api/profile" && method === "GET") {
    return response(200, (await loadDb()).profile);
  }

  if (url.pathname === "/api/profile" && method === "PATCH") {
    const body = parseBody(event);
    const db = await mutateDb((draft) => {
      draft.profile.name = typeof body.name === "string" ? body.name : draft.profile.name;
      draft.profile.city = typeof body.city === "string" ? body.city : draft.profile.city;
      draft.profile.role = ["business", "admin", "traveler"].includes(body.role) ? body.role : draft.profile.role;
    });
    return response(200, db.profile);
  }

  if (url.pathname === "/api/places" && method === "GET") {
    const db = await loadDb();
    const search = url.searchParams.get("search") ?? "";
    const category = url.searchParams.get("category") ?? "All";
    const budget = url.searchParams.get("budget") ?? "All";
    const places = db.places.filter((place) => {
      return matchesSearch(place, search)
        && (category === "All" || place.category === category)
        && (budget === "All" || place.budget === budget);
    });
    return response(200, places);
  }

  if (url.pathname === "/api/places" && method === "POST") {
    const body = parseBody(event);
    const place = {
      id: newId("place"),
      name: requiredString(body, "name"),
      city: requiredString(body, "city"),
      category: ["Hotel", "Restaurant", "Tour"].includes(body.category) ? body.category : "Attraction",
      budget: ["Low", "Premium"].includes(body.budget) ? body.budget : "Medium",
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
    const db = await mutateDb((draft) => draft.places.unshift(place));
    return response(201, { place, places: db.places });
  }

  if (parts[0] === "api" && parts[1] === "places" && parts[2] && !parts[3] && method === "GET") {
    const place = (await loadDb()).places.find((item) => item.id === parts[2]);
    return place ? response(200, place) : response(404, { error: "Place not found" });
  }

  if (parts[0] === "api" && parts[1] === "places" && parts[2] && !parts[3] && method === "PUT") {
    const body = parseBody(event);
    let updated;
    const db = await mutateDb((draft) => {
      const place = draft.places.find((item) => item.id === parts[2]);
      if (!place) return;
      place.name = typeof body.name === "string" && body.name ? body.name : place.name;
      place.city = typeof body.city === "string" && body.city ? body.city : place.city;
      place.description = typeof body.description === "string" && body.description ? body.description : place.description;
      place.priceFromUsd = optionalNumber(body, "priceFromUsd", place.priceFromUsd);
      updated = place;
    });
    return updated ? response(200, { place: updated, places: db.places }) : response(404, { error: "Place not found" });
  }

  if (parts[0] === "api" && parts[1] === "places" && parts[3] === "save" && method === "POST") {
    const db = await mutateDb((draft) => {
      const place = draft.places.find((item) => item.id === parts[2]);
      if (place) place.likes += 1;
      if (parts[2] && !draft.profile.savedPlaceIds.includes(parts[2])) draft.profile.savedPlaceIds.push(parts[2]);
    });
    return response(200, {
      saved: db.places.filter((place) => db.profile.savedPlaceIds.includes(place.id)),
      places: db.places
    });
  }

  if (url.pathname === "/api/saved" && method === "GET") {
    const db = await loadDb();
    return response(200, db.places.filter((place) => db.profile.savedPlaceIds.includes(place.id)));
  }

  if (url.pathname === "/api/reviews" && method === "GET") {
    const db = await loadDb();
    const placeId = url.searchParams.get("placeId");
    return response(200, placeId ? db.reviews.filter((review) => review.placeId === placeId) : db.reviews);
  }

  if (url.pathname === "/api/reviews" && method === "POST") {
    const body = parseBody(event);
    const rating = Math.min(5, Math.max(1, optionalNumber(body, "rating", 5)));
    const review = {
      id: newId("review"),
      placeId: requiredString(body, "placeId"),
      author: typeof body.author === "string" && body.author ? body.author : "Demo traveler",
      rating,
      comment: requiredString(body, "comment"),
      helpful: 0,
      status: "visible",
      createdAt: new Date().toISOString().slice(0, 10)
    };
    const db = await mutateDb((draft) => {
      draft.reviews.unshift(review);
      const place = draft.places.find((item) => item.id === review.placeId);
      if (place) {
        const reviews = draft.reviews.filter((item) => item.placeId === place.id);
        place.reviewCount = reviews.length;
        place.rating = Number((reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1));
      }
    });
    return response(201, { review, reviews: db.reviews, places: db.places });
  }

  if (url.pathname === "/api/trips" && method === "GET") {
    return response(200, (await loadDb()).trips);
  }

  if (url.pathname === "/api/trips" && method === "POST") {
    const body = parseBody(event);
    const trip = {
      id: newId("trip"),
      title: requiredString(body, "title"),
      destination: requiredString(body, "destination"),
      budgetUsd: optionalNumber(body, "budgetUsd", 220),
      visibility: body.visibility === "public" ? "public" : "private",
      savedAt: new Date().toISOString().slice(0, 10),
      days: [{
        day: 1,
        title: "Arrival and highlights",
        placeIds: typeof body.placeId === "string" ? [body.placeId] : [],
        notes: typeof body.notes === "string" && body.notes ? body.notes : "Start with saved places, reviews, and one booking request."
      }]
    };
    const db = await mutateDb((draft) => draft.trips.unshift(trip));
    return response(201, { trip, trips: db.trips });
  }

  if (parts[0] === "api" && parts[1] === "trips" && parts[2] && !parts[3] && method === "GET") {
    const trip = (await loadDb()).trips.find((item) => item.id === parts[2]);
    return trip ? response(200, trip) : response(404, { error: "Trip not found" });
  }

  if (parts[0] === "api" && parts[1] === "trips" && parts[2] && !parts[3] && method === "PUT") {
    const body = parseBody(event);
    let updated;
    const db = await mutateDb((draft) => {
      const trip = draft.trips.find((item) => item.id === parts[2]);
      if (!trip) return;
      trip.title = typeof body.title === "string" && body.title ? body.title : trip.title;
      trip.destination = typeof body.destination === "string" && body.destination ? body.destination : trip.destination;
      trip.budgetUsd = optionalNumber(body, "budgetUsd", trip.budgetUsd);
      updated = trip;
    });
    return updated ? response(200, { trip: updated, trips: db.trips }) : response(404, { error: "Trip not found" });
  }

  if (url.pathname === "/api/bookings" && method === "GET") {
    return response(200, (await loadDb()).bookings);
  }

  if (url.pathname === "/api/bookings" && method === "POST") {
    const body = parseBody(event);
    const booking = {
      id: newId("booking"),
      placeId: requiredString(body, "placeId"),
      tripId: typeof body.tripId === "string" ? body.tripId : undefined,
      guestName: requiredString(body, "guestName"),
      date: requiredString(body, "date"),
      guests: optionalNumber(body, "guests", 1),
      status: "requested",
      note: typeof body.note === "string" ? body.note : ""
    };
    const db = await mutateDb((draft) => draft.bookings.unshift(booking));
    return response(201, { booking, bookings: db.bookings });
  }

  if (url.pathname === "/api/business/summary" && method === "GET") {
    const db = await loadDb();
    return response(200, {
      ownedListings: db.places.filter((place) => place.owner !== "Community submission").length,
      pendingListings: db.places.filter((place) => place.status === "pending").length,
      bookingRequests: db.bookings.filter((booking) => booking.status === "requested").length,
      averageRating: Number((db.places.reduce((sum, place) => sum + place.rating, 0) / db.places.length).toFixed(1))
    });
  }

  if (url.pathname === "/api/admin/summary" && method === "GET") {
    const db = await loadDb();
    return response(200, {
      users: 38,
      places: db.places.length,
      reportedReviews: db.reviews.filter((review) => review.status === "reported").length,
      pendingListings: db.places.filter((place) => place.status === "pending").length,
      awsReadiness: ["CloudFront", "API Gateway", "Lambda", "DynamoDB", "cost-safe"]
    });
  }

  if (url.pathname === "/api/ai/suggestions" && method === "POST") {
    const body = parseBody(event);
    const city = typeof body.city === "string" && body.city ? body.city : "Da Nang";
    const db = await loadDb();
    const related = db.places
      .filter((place) => place.city.toLowerCase().includes(city.toLowerCase()) || place.tags.some((tag) => tag.includes("beach")))
      .slice(0, 3);
    return response(200, {
      mode: "rule-based-fallback",
      city,
      ideas: [
        `Start with ${related[0]?.name ?? "a saved place"} for low-risk demo flow.`,
        "Add one review stop and one booking request so the fullstack slices are visible.",
        "Use CloudFront default HTTPS domain for the submission demo unless a custom domain is already ready."
      ],
      relatedPlaceIds: related.map((place) => place.id)
    });
  }

  if (parts[0] === "api" && parts[1] === "export" && parts[2] === "trips" && parts[3] && method === "GET") {
    const db = await loadDb();
    const trip = db.trips.find((item) => item.id === parts[3]);
    if (!trip) return response(404, { error: "Trip not found" });
    const rows = trip.days.map((day) => `<li><strong>Day ${day.day}: ${day.title}</strong><br>${day.notes}</li>`).join("");
    return htmlResponse(`<!doctype html><html><head><title>${trip.title}</title><style>body{font-family:Inter,Arial,sans-serif;max-width:760px;margin:48px auto;color:#123}h1{color:#075985}.meta{color:#64748b}li{margin:14px 0}@media print{button{display:none}}</style></head><body><h1>${trip.title}</h1><p class="meta">${trip.destination} - Budget $${trip.budgetUsd} - ${trip.visibility}</p><ul>${rows}</ul><p>Generated by V-Trips demo export. Use browser Print -> Save as PDF.</p><button onclick="window.print()">Print / Save PDF</button></body></html>`);
  }

  return response(404, { error: `No route for ${method} ${url.pathname}` });
}

export async function handler(event) {
  try {
    return await route(event);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Lambda error";
    return response(400, { error: message });
  }
}
