import { NextRequest, NextResponse } from "next/server";
import { parsePlaylistUrl, PlaylistUrlError } from "@/lib/spotify/parse-playlist-url";
import { getPlaylist, PlaylistError } from "@/lib/spotify/playlists";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing 'url' query parameter" },
      { status: 400 }
    );
  }

  let playlistId: string;
  try {
    playlistId = parsePlaylistUrl(url);
  } catch (error) {
    if (error instanceof PlaylistUrlError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to parse playlist URL" },
      { status: 400 }
    );
  }

  try {
    const playlist = await getPlaylist(playlistId);
    return NextResponse.json(playlist);
  } catch (error) {
    if (error instanceof PlaylistError) {
      const status = error.message.includes("not found")
        ? 404
        : error.message.includes("rate limit")
          ? 429
          : 502;
      return NextResponse.json({ error: error.message }, { status });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
