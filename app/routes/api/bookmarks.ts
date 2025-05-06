import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { postBookmarksToDB, getBookmarksFromDB } from "../../db/bookmarks";
import { c } from "vinxi/dist/types/lib/logger";


export const APIRoute = createAPIFileRoute("/api/bookmarks")({
  POST: async ({ request, params }) => {
    try {
      const existingBookmarks = await getBookmarksFromDB();
      const reqBookmarks = await request.json();
      const bookmarks = reqBookmarks.map((bookmark: any) => {
        const existing = existingBookmarks.find(b => b.id === bookmark.id);
        if (existing) {
          return existing
        } else {
          return {
            ...bookmark,
            createdAt: new Date().toISOString(),
            consumed: false,
          }
        }
      })
      await postBookmarksToDB({...existingBookmarks, ...bookmarks});
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
      const bookmarks = await getBookmarksFromDB();
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
});
