import assert from "node:assert/strict";
import { handler } from "./lambda/index.mjs";

process.env.VTRIPS_TEST_MODE = "memory";

function event(method, rawPath, body, rawQueryString = "") {
  return {
    version: "2.0",
    rawPath,
    rawQueryString,
    requestContext: {
      http: { method, path: rawPath }
    },
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    isBase64Encoded: false
  };
}

async function json(method, path, body, query) {
  const result = await handler(event(method, path, body, query));
  const parsed = result.body ? JSON.parse(result.body) : {};
  return { ...result, parsed };
}

const health = await json("GET", "/api/health");
assert.equal(health.statusCode, 200);
assert.equal(health.parsed.status, "ok");
assert.equal(health.parsed.runtime, "nodejs22.x");

const places = await json("GET", "/api/places", undefined, "search=Da%20Nang&category=All&budget=All");
assert.equal(places.statusCode, 200);
assert.ok(Array.isArray(places.parsed));
assert.ok(places.parsed.length >= 1);

const trip = await json("POST", "/api/trips", {
  title: "Lambda smoke trip",
  destination: "Da Nang",
  budgetUsd: 250,
  visibility: "public",
  placeId: places.parsed[0].id,
  notes: "Created by local Lambda smoke test."
});
assert.equal(trip.statusCode, 201);
assert.equal(trip.parsed.trip.destination, "Da Nang");

const review = await json("POST", "/api/reviews", {
  placeId: places.parsed[0].id,
  author: "Smoke Test",
  rating: 5,
  comment: "Lambda handler smoke test review."
});
assert.equal(review.statusCode, 201);
assert.equal(review.parsed.review.status, "visible");

const ai = await json("POST", "/api/ai/suggestions", { city: "Da Nang" });
assert.equal(ai.statusCode, 200);
assert.equal(ai.parsed.mode, "rule-based-fallback");
assert.ok(ai.parsed.ideas.length > 0);

const exported = await handler(event("GET", `/api/export/trips/${trip.parsed.trip.id}`));
assert.equal(exported.statusCode, 200);
assert.match(exported.headers["content-type"], /text\/html/);
assert.match(exported.body, /Lambda smoke trip/);

console.log("Lambda smoke test passed.");
