import { describe, it, expect } from "vitest";
import {
  HISTORY_LIMIT,
  addHistoryEntry,
  clearHistory,
  exportHistoryJson,
  removeHistoryEntry,
} from "../src/lib/history";
import type { HistoryEntry } from "../src/lib/history";
import { DEFAULT_SETTINGS } from "../src/lib/storage";

function makeEntry(overrides: Partial<HistoryEntry> = {}): HistoryEntry {
  return {
    id: "id",
    playlistName: "My Playlist",
    url: "https://open.spotify.com/playlist/abc",
    thumbnail: "",
    settings: DEFAULT_SETTINGS,
    createdAt: 123456,
    ...overrides,
  };
}

describe("addHistoryEntry", () => {
  it("adds newest entries to the front with id and createdAt", () => {
    const list = addHistoryEntry([], {
      playlistName: "Newest",
      url: "url",
      thumbnail: "",
      settings: DEFAULT_SETTINGS,
    });
    expect(list).toHaveLength(1);
    expect(list[0].playlistName).toBe("Newest");
    expect(list[0].id).toBeTruthy();
    expect(typeof list[0].createdAt).toBe("number");
  });

  it("caps the list at HISTORY_LIMIT entries", () => {
    let list: HistoryEntry[] = [];
    for (let i = 0; i < HISTORY_LIMIT + 5; i++) {
      list = addHistoryEntry(list, {
        playlistName: `Playlist ${i}`,
        url: `url-${i}`,
        thumbnail: "",
        settings: DEFAULT_SETTINGS,
      });
    }
    expect(list).toHaveLength(HISTORY_LIMIT);
    expect(list[0].playlistName).toBe(`Playlist ${HISTORY_LIMIT + 4}`);
    expect(list[list.length - 1].playlistName).toBe("Playlist 5");
  });

  it("respects a custom limit", () => {
    let list: HistoryEntry[] = [];
    for (let i = 0; i < 5; i++) {
      list = addHistoryEntry(
        list,
        { playlistName: `P${i}`, url: "u", thumbnail: "", settings: DEFAULT_SETTINGS },
        3
      );
    }
    expect(list).toHaveLength(3);
    expect(list[0].playlistName).toBe("P4");
  });
});

describe("removeHistoryEntry", () => {
  it("removes the matching entry by id", () => {
    const list = [
      makeEntry({ id: "a" }),
      makeEntry({ id: "b" }),
      makeEntry({ id: "c" }),
    ];
    expect(removeHistoryEntry(list, "b")).toHaveLength(2);
    expect(removeHistoryEntry(list, "b").map((e) => e.id)).toEqual(["a", "c"]);
  });

  it("returns the same array when id is missing", () => {
    const list = [makeEntry({ id: "a" })];
    expect(removeHistoryEntry(list, "nope")).toEqual(list);
  });
});

describe("clearHistory / exportHistoryJson", () => {
  it("returns an empty array", () => {
    expect(clearHistory()).toEqual([]);
  });

  it("exports entries as pretty JSON", () => {
    const list = [makeEntry({ playlistName: "A" }), makeEntry({ playlistName: "B" })];
    const json = exportHistoryJson(list);
    const parsed = JSON.parse(json);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].playlistName).toBe("A");
    expect(json).toContain("\n  ");
  });
});
