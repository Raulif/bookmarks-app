import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { postBookmarksToDB, getBookmarksFromDB } from "../../db/bookmarks";


export const APIRoute = createAPIFileRoute("/api/bookmarks")({
  POST: async ({ request, params }) => {
    try {
      const bookmarks = await request.json();
      await postBookmarksToDB(bookmarks);
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
