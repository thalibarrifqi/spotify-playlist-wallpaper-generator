import { NextRequest, NextResponse } from "next/server";
import { parsePlaylistUrl, PlaylistUrlError } from "@/lib/spotify/parse-playlist-url";
import { getPlaylist, PlaylistError, RateLimitError } from "@/lib/spotify/playlists";

const STATUS = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  BAD_GATEWAY: 502,
  INTERNAL_ERROR: 500,
} as const;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing 'url' query parameter" },
      { status: STATUS.BAD_REQUEST }
    );
  }

  let playlistId: string;
  try {
    playlistId = parsePlaylistUrl(url);
  } catch (error) {
    if (error instanceof PlaylistUrlError) {
      return NextResponse.json({ error: error.message }, { status: STATUS.BAD_REQUEST });
    }
    return NextResponse.json(
      { error: "Failed to parse playlist URL" },
      { status: STATUS.BAD_REQUEST }
    );
  }

  try {
    const playlist = await getPlaylist(playlistId);
    return NextResponse.json(playlist);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { 
          error: error.message,
          code: "RATE_LIMIT_EXCEEDED",
          isFreeAccount: error.isFreeAccount
        },
        { status: STATUS.RATE_LIMITED }
      );
    }
    if (error instanceof PlaylistError) {
      const status = error.message.includes("not found")
        ? STATUS.NOT_FOUND
        : STATUS.BAD_GATEWAY;
      return NextResponse.json({ error: error.message }, { status });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: STATUS.INTERNAL_ERROR }
    );
  }
}
