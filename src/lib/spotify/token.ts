export class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenError";
  }
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const EXPIRY_BUFFER_MS = 60_000;

function getCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new TokenError(
      "Missing Spotify credentials. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local"
    );
  }

  return { clientId, clientSecret };
}

function isTokenValid(): boolean {
  return cachedToken !== null && Date.now() < tokenExpiry - EXPIRY_BUFFER_MS;
}

async function fetchNewToken(): Promise<string> {
  const { clientId, clientSecret } = getCredentials();

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new TokenError(
      `Spotify token request failed (${response.status}): ${body}`
    );
  }

  const data: TokenResponse = await response.json();

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;

  return cachedToken;
}

export async function getAccessToken(): Promise<string> {
  if (isTokenValid()) {
    return cachedToken!;
  }

  return fetchNewToken();
}
