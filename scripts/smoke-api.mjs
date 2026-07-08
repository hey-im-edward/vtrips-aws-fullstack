const baseUrl = process.env.VTRIPS_API_URL ?? "http://127.0.0.1:8787";

const response = await fetch(`${baseUrl}/api/health`);
if (!response.ok) {
  throw new Error(`Health check failed: ${response.status}`);
}

const payload = await response.json();
if (payload.status !== "ok") {
  throw new Error(`Unexpected health payload: ${JSON.stringify(payload)}`);
}

console.log(`API smoke check passed at ${baseUrl}`);
