import { FormEvent, useEffect, useMemo, useState } from "react";
import { api, apiUrl } from "./api";
import type { AiSuggestion, Booking, DashboardSummary, Place, Profile, Review, Trip } from "./types";

const categories = ["All", "Hotel", "Restaurant", "Attraction", "Tour"] as const;
const budgets = ["All", "Low", "Medium", "Premium"] as const;

type Tab = "explore" | "trips" | "saved" | "business" | "admin";

function tabFromHash(): Tab {
  const value = window.location.hash.replace("#", "");
  return value === "trips" || value === "saved" || value === "business" || value === "admin" ? value : "explore";
}

interface AppState {
  profile?: Profile;
  places: Place[];
  trips: Trip[];
  saved: Place[];
  reviews: Review[];
  bookings: Booking[];
  business?: DashboardSummary;
  admin?: DashboardSummary;
  ai?: AiSuggestion;
}

const emptyState: AppState = {
  places: [],
  trips: [],
  saved: [],
  reviews: [],
  bookings: []
};

function formPayload(form: HTMLFormElement): Record<string, FormDataEntryValue> {
  return Object.fromEntries(new FormData(form).entries());
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action ? <span>{action}</span> : null}
    </div>
  );
}

function PlaceCard({ place, active, saved, onSelect, onSave }: {
  place: Place;
  active: boolean;
  saved: boolean;
  onSelect: () => void;
  onSave: () => void;
}) {
  return (
    <article className={`place-card ${active ? "active" : ""}`}>
      <button className="image-button" type="button" onClick={onSelect} aria-label={`Open ${place.name}`}>
        <img src={place.image} alt={place.name} />
      </button>
      <div className="place-content">
        <div className="place-meta">
          <span>{place.category}</span>
          <span>{place.city}</span>
        </div>
        <button className="text-button place-name" type="button" onClick={onSelect}>{place.name}</button>
        <p>{place.description}</p>
        <div className="tag-row">
          {place.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="card-footer">
          <strong>{place.rating.toFixed(1)} ★</strong>
          <span>{place.reviewCount} reviews</span>
          <span>from ${place.priceFromUsd}</span>
          <button className="small-button" type="button" onClick={onSave}>{saved ? "Saved" : "Save"}</button>
        </div>
      </div>
    </article>
  );
}

function DetailPanel({ place, reviews, trips, onReview, onBooking, onExport }: {
  place?: Place;
  reviews: Review[];
  trips: Trip[];
  onReview: (event: FormEvent<HTMLFormElement>) => void;
  onBooking: (event: FormEvent<HTMLFormElement>) => void;
  onExport: (tripId: string) => void;
}) {
  if (!place) {
    return (
      <aside className="detail-panel empty-panel">
        <h2>Select a place</h2>
        <p>Choose a destination card to inspect reviews, request a booking, or attach it to a trip.</p>
      </aside>
    );
  }

  return (
    <aside className="detail-panel">
      <img className="detail-image" src={place.image} alt={place.name} />
      <div className="detail-header">
        <div>
          <p>{place.category} · {place.city}</p>
          <h2>{place.name}</h2>
        </div>
        <strong>{place.rating.toFixed(1)} ★</strong>
      </div>
      <p>{place.description}</p>
      <div className="status-row">
        <span>{place.budget} budget</span>
        <span>{place.status}</span>
        <span>{place.likes} saves/likes</span>
      </div>

      <div className="panel-block">
        <h3>Review list/form</h3>
        {reviews.length === 0 ? <p className="muted">No reviews yet. Add one for the demo flow.</p> : reviews.map((review) => (
          <div className="review" key={review.id}>
            <strong>{review.author} · {review.rating} ★</strong>
            <p>{review.comment}</p>
          </div>
        ))}
        <form className="inline-form" onSubmit={onReview}>
          <input name="author" placeholder="Reviewer name" defaultValue="Demo traveler" />
          <select name="rating" defaultValue="5">
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
          </select>
          <textarea name="comment" placeholder="Write a short review" required />
          <button type="submit">Add review</button>
        </form>
      </div>

      <div className="panel-block">
        <h3>Booking request basic</h3>
        <form className="inline-form" onSubmit={onBooking}>
          <input name="guestName" placeholder="Guest name" defaultValue="Edward Tran" required />
          <input name="date" type="date" defaultValue="2026-07-20" required />
          <input name="guests" type="number" min="1" defaultValue="2" />
          <textarea name="note" placeholder="Booking note" defaultValue="Need a sunset slot for demo." />
          <button type="submit">Request booking</button>
        </form>
      </div>

      <div className="panel-block">
        <h3>Export PDF basic</h3>
        <p className="muted">Export opens a print-ready itinerary. Use browser Print → Save as PDF.</p>
        {trips.length > 0 ? (
          <button type="button" onClick={() => onExport(trips[0].id)}>Export trip</button>
        ) : (
          <button type="button" disabled>Export trip</button>
        )}
      </div>
    </aside>
  );
}

function TripList({ trips, places, onCreateTrip }: {
  trips: Trip[];
  places: Place[];
  onCreateTrip: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section className="content-section" id="trips">
      <SectionTitle title="Trip list and day itinerary" action={`${trips.length} trips`} />
      <div className="split-grid">
        <div className="timeline-list">
          {trips.map((trip) => (
            <article className="trip-card" key={trip.id}>
              <div>
                <p>{trip.destination} · ${trip.budgetUsd}</p>
                <h3>{trip.title}</h3>
              </div>
              {trip.days.map((day) => (
                <div className="day-row" key={`${trip.id}-${day.day}`}>
                  <span>Day {day.day}</span>
                  <strong>{day.title}</strong>
                  <p>{day.notes}</p>
                </div>
              ))}
            </article>
          ))}
        </div>
        <form className="creator-form" onSubmit={onCreateTrip}>
          <h3>Create/Edit trip</h3>
          <input name="title" placeholder="Trip title" defaultValue="Weekend food and coast run" required />
          <input name="destination" placeholder="Destination" defaultValue="Da Nang" required />
          <input name="budgetUsd" type="number" defaultValue="220" />
          <select name="visibility" defaultValue="public">
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <select name="placeId" defaultValue={places[0]?.id}>
            {places.map((place) => <option value={place.id} key={place.id}>{place.name}</option>)}
          </select>
          <textarea name="notes" placeholder="Day 1 notes" defaultValue="Arrival, saved places, review stop, booking request." />
          <button type="submit">Create trip</button>
        </form>
      </div>
    </section>
  );
}

function Dashboard({ title, summary }: { title: string; summary?: DashboardSummary }) {
  return (
    <section className="content-section">
      <SectionTitle title={title} />
      <div className="dashboard-grid">
        {summary ? Object.entries(summary).map(([key, value]) => (
          <div className="dashboard-card" key={key}>
            <span>{key.replace(/([A-Z])/g, " $1")}</span>
            <strong>{Array.isArray(value) ? value.join(", ") : value}</strong>
          </div>
        )) : <p className="muted">Dashboard loading...</p>}
      </div>
    </section>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(() => tabFromHash());
  const [state, setState] = useState<AppState>(emptyState);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [budget, setBudget] = useState<(typeof budgets)[number]>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const selectedPlace = useMemo(() => {
    return state.places.find((place) => place.id === selectedPlaceId) ?? state.places[0];
  }, [selectedPlaceId, state.places]);

  const currentReviews = useMemo(() => {
    return selectedPlace ? state.reviews.filter((review) => review.placeId === selectedPlace.id) : [];
  }, [selectedPlace, state.reviews]);

  async function refresh(params = { search, category, budget }) {
    setError(undefined);
    const query = new URLSearchParams();
    query.set("search", params.search);
    query.set("category", params.category);
    query.set("budget", params.budget);
    const [profile, places, trips, saved, reviews, bookings, business, admin] = await Promise.all([
      api.profile(),
      api.places(query),
      api.trips(),
      api.saved(),
      api.reviews(""),
      api.bookings(),
      api.business(),
      api.admin()
    ]);
    setState({ profile, places, trips, saved, reviews, bookings, business, admin, ai: state.ai });
    if (!selectedPlaceId && places[0]) {
      setSelectedPlaceId(places[0].id);
    }
  }

  useEffect(() => {
    refresh().catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load app data")).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectTab(tab: Tab) {
    setActiveTab(tab);
    window.history.replaceState(null, "", tab === "explore" ? window.location.pathname : `#${tab}`);
  }

  async function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await refresh({ search, category, budget });
  }

  async function demoLogin() {
    const login = await api.demoLogin();
    setState((current) => ({ ...current, profile: login.user }));
    setSuccess(`Demo auth active: ${login.authMode}`);
  }

  async function savePlace(id: string) {
    const result = await api.savePlace(id);
    setState((current) => ({ ...current, saved: result.saved, places: result.places }));
    setSuccess("Place saved and like count updated.");
  }

  async function createPlace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const result = await api.createPlace(formPayload(form));
    setState((current) => ({ ...current, places: result.places }));
    setSelectedPlaceId(result.place.id);
    form.reset();
    setSuccess("Create/Edit place flow saved a pending listing.");
  }

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await api.createTrip(formPayload(event.currentTarget));
    setState((current) => ({ ...current, trips: result.trips }));
    setActiveTab("trips");
    setSuccess("Trip created with day itinerary.");
  }

  async function addReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPlace) return;
    const payload = { ...formPayload(event.currentTarget), placeId: selectedPlace.id };
    const result = await api.createReview(payload);
    setState((current) => ({ ...current, reviews: result.reviews, places: result.places }));
    setSuccess("Review submitted and rating recalculated.");
  }

  async function addBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPlace) return;
    const payload = { ...formPayload(event.currentTarget), placeId: selectedPlace.id, tripId: state.trips[0]?.id ?? "" };
    const result = await api.createBooking(payload);
    setState((current) => ({ ...current, bookings: result.bookings }));
    setSuccess("Booking request created.");
  }

  async function requestAiIdeas() {
    const city = selectedPlace?.city ?? (search || "Da Nang");
    const ai = await api.ai(city);
    setState((current) => ({ ...current, ai }));
    setSuccess("AI suggestion fallback generated deterministic ideas.");
  }

  function exportTrip(tripId: string) {
    window.open(apiUrl(`/api/export/trips/${tripId}`), "_blank", "noopener,noreferrer");
  }

  return (
    <main>
      <header className="app-header">
        <a className="brand" href="#top" aria-label="V-Trips home">
          <span>V</span>
          V-Trips
        </a>
        <nav aria-label="Main navigation">
          {(["explore", "trips", "saved", "business", "admin"] as Tab[]).map((tab) => (
            <button className={activeTab === tab ? "active" : ""} type="button" key={tab} onClick={() => selectTab(tab)}>
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <button className="primary-button" type="button" onClick={demoLogin}>
          {state.profile ? state.profile.avatar : "Login"}
        </button>
      </header>

      <section className="hero-grid" id="top">
        <div className="hero-copy">
          <h1>Plan better trips from trusted local places</h1>
          <p>Discover places, build day itineraries, save reviews, request bookings, and present an AWS-ready travel platform demo from one local app.</p>
          <form className="search-bar" onSubmit={applyFilters}>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search places, cities, budgets" />
            <select value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={budget} onChange={(event) => setBudget(event.target.value as typeof budget)}>
              {budgets.map((item) => <option key={item}>{item}</option>)}
            </select>
            <button type="submit">Explore</button>
          </form>
        </div>
        <div className="hero-panel">
          <Stat label="Places" value={state.places.length} />
          <Stat label="Trips" value={state.trips.length} />
          <Stat label="Bookings" value={state.bookings.length} />
          <Stat label="AWS target" value="Serverless" />
        </div>
      </section>

      {error ? <div className="notice error">{error}</div> : null}
      {success ? <div className="notice success">{success}</div> : null}
      {loading ? <div className="notice">Loading V-Trips demo data...</div> : null}

      {activeTab === "explore" ? (
        <section className="app-layout">
          <div className="main-column">
            <SectionTitle title="Place discovery" action={`${state.places.length} results`} />
            {state.places.length === 0 ? (
              <div className="empty-state">
                <h3>No places match this filter.</h3>
                <p>Try a different city, category, or budget.</p>
              </div>
            ) : (
              <div className="place-grid">
                {state.places.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    active={selectedPlace?.id === place.id}
                    saved={state.saved.some((item) => item.id === place.id)}
                    onSelect={() => setSelectedPlaceId(place.id)}
                    onSave={() => savePlace(place.id)}
                  />
                ))}
              </div>
            )}

            <section className="content-section">
              <SectionTitle title="Create/Edit place" action="Owner-ready flow" />
              <form className="creator-form wide" onSubmit={createPlace}>
                <input name="name" placeholder="Place name" defaultValue="Nha Trang Island Coffee Route" required />
                <input name="city" placeholder="City" defaultValue="Nha Trang" required />
                <select name="category" defaultValue="Tour">
                  <option>Hotel</option>
                  <option>Restaurant</option>
                  <option>Attraction</option>
                  <option>Tour</option>
                </select>
                <select name="budget" defaultValue="Medium">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>Premium</option>
                </select>
                <input name="priceFromUsd" type="number" defaultValue="18" />
                <input name="tags" defaultValue="island, coffee, local guide" />
                <textarea name="description" defaultValue="A community-submitted route for island hopping, local coffee, and a review-ready mini itinerary." required />
                <button type="submit">Save listing draft</button>
              </form>
            </section>

            <section className="content-section ai-section">
              <SectionTitle title="AI trip ideas" action={state.ai?.mode ?? "Fallback ready"} />
              <button type="button" onClick={requestAiIdeas}>Generate local suggestion</button>
              {state.ai ? (
                <ul>
                  {state.ai.ideas.map((idea) => <li key={idea}>{idea}</li>)}
                </ul>
              ) : (
                <p className="muted">Rule-based fallback is used until Bedrock integration is approved.</p>
              )}
            </section>
          </div>
          <DetailPanel place={selectedPlace} reviews={currentReviews} trips={state.trips} onReview={addReview} onBooking={addBooking} onExport={exportTrip} />
        </section>
      ) : null}

      {activeTab === "trips" ? <TripList trips={state.trips} places={state.places} onCreateTrip={createTrip} /> : null}

      {activeTab === "saved" ? (
        <section className="content-section">
          <SectionTitle title="Saved places" action={`${state.saved.length} saved`} />
          <div className="place-grid compact">
            {state.saved.map((place) => (
              <PlaceCard key={place.id} place={place} active={false} saved onSelect={() => setSelectedPlaceId(place.id)} onSave={() => savePlace(place.id)} />
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "business" ? <Dashboard title="Business dashboard basic" summary={state.business} /> : null}
      {activeTab === "admin" ? <Dashboard title="Admin dashboard basic" summary={state.admin} /> : null}

      <footer className="app-footer">
        <div>
          <strong>Implemented</strong>
          <span>Local API, React UI, JSON persistence, booking/review/trip/place slices.</span>
        </div>
        <div>
          <strong>Prototype/Fallback</strong>
          <span>Demo auth, rule-based AI, browser print PDF export.</span>
        </div>
        <div>
          <strong>AWS target</strong>
          <span>S3, CloudFront, API Gateway, Lambda, DynamoDB, Cognito, CloudWatch, IAM.</span>
        </div>
      </footer>
    </main>
  );
}
