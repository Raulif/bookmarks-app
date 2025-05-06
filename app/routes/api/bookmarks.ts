import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { postBookmarksToDB, getBookmarksFromDB, updateBookmarkInDB } from "../../db/bookmarks";
import { setHeaders, setResponseStatus } from "@tanstack/react-start/server";

export const APIRoute = createAPIFileRoute("/api/bookmarks")({
  POST: async ({ request, params }) => {
    try {
      const response = await getBookmarksFromDB();
      const existingBookmarks = response.bookmarks ?? [];
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
      return json({ ok: true, message: "Bookmarks added" });
    } catch (error) {
      console.log(error);
      setResponseStatus(500);
      return json({ error: error.message });
    }
  },

  GET: async ({ request, params }) => {
    try {
      const {bookmarks} = await getBookmarksFromDB();
      setResponseStatus(200);
      return json(bookmarks);
    } catch (error) {
      setResponseStatus(500);
      return json({ error: error.message });
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

      const {bookmarks, _id} = response;

      const updatedBookmarks = bookmarks.map((b) => {
        if (b.bookmarkId === bookmark.id) {
          console.log("found bookmark", b);
          return { ...b, consumed: bookmark.consumed };
        }
        return b;
      });
      await updateBookmarkInDB(_id, updatedBookmarks);
      setHeaders({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      setResponseStatus(200);
      return json({ ok: true, message: "Bookmark updated" });
    } catch (error) {
      return json({ error: error.message }, { status: 500 });
    }
  },
});
