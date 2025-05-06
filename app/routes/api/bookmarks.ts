import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { postBookmarksToDB, getBookmarksFromDB } from "../../db/bookmarks";
import { setHeaders, setResponseStatus } from "@tanstack/react-start/server";

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
            createdAt: new Date().getTime(),
            consumed: false,
          };
        }
      });

      await postBookmarksToDB(Array.from([...existingBookmarks, ...bookmarks]));
      setHeaders({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      setResponseStatus(200);
      return json("Bookmarks added successfully");
    } catch (error) {
      console.log(error);
      return json({ error: error.message, status: 500 });
    }
  },

  GET: async ({ request, params }) => {
    try {
      const response = await getBookmarksFromDB();
      const bookmarks = response.length ? response[0].bookmarks : [];
      setResponseStatus(200);
      return json(bookmarks, { status: 200 });
    } catch (error) {
      return json({ error: error.message, status: 500 });
    }
  },

  OPTIONS: async ({ request, params }) => {
    setResponseStatus(200);
    setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return json(null);
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
      setHeaders({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      setResponseStatus(200);
      return json("Bookmark updated successfully");
    } catch (error) {
      return json({ error: error.message }, { status: 500 });
    }
  },
});
