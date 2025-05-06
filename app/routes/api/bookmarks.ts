import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { postBookmarksToDB, getBookmarksFromDB } from "../../db/bookmarks";
import { c } from "vinxi/dist/types/lib/logger";

export const APIRoute = createAPIFileRoute("/api/bookmarks")({
  POST: async ({ request, params }) => {
    try {
      const response = await getBookmarksFromDB();
      const existingBookmarks = response.length ? response[0].bookmarks : [];
      const reqBookmarks = await request.json();
      const bookmarks = reqBookmarks.map((bookmark: any) => {
        const existing = existingBookmarks.find((b) => b.id === bookmark.id);
        if (existing) {
          return existing;
        } else {
          return {
            ...bookmark,
            createdAt: new Date().toISOString(),
            consumed: false,
          };
        }
      });
      await postBookmarksToDB({ ...existingBookmarks, ...bookmarks });
      return json(
        { message: "Bookmarks added successfully" },
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    } catch (error) {
      console.log(error);
      return json({ error: error.message }, { status: 500 });
    }
  },

  GET: async ({ request, params }) => {
    try {
      const response = await getBookmarksFromDB();
      const bookmarks = response.length ? response[0].bookmarks : [];

      return json(bookmarks, { status: 200 });
    } catch (error) {
      return json({ error: error.message }, { status: 500 });
    }
  },

  OPTIONS: async ({ request, params }) => {
    return json(
      {},
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  },

  PUT: async ({ request, params }) => {
    try {
      const bookmark = await request.json();
      const response = await getBookmarksFromDB();
      const bookmarks = response.length ? response[0].bookmarks : [];

      const updatedBookmarks = bookmarks.map((b) => {
        if (b.bookmarkId === bookmark.id) {
          console.log("found bookmark", b);
          return { ...b, consumed: bookmark.consumed };
        }
        return b;
      });
      await postBookmarksToDB(updatedBookmarks);
      return json(
        { message: "Bookmark updated successfully" },
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    } catch (error) {
      return json({ error: error.message }, { status: 500 });
    }
  },
});
