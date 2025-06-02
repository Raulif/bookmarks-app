import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import {
  postBookmarksToDB,
  getBookmarksFromDB,
  updateBookmarkInDB,
} from "../../db/bookmarks";
import { setHeaders, setResponseStatus } from "@tanstack/react-start/server";
import type { Bookmark } from "../../types/bookmark";
import { isHearable } from '../../lib/helpers';

export const APIRoute = createAPIFileRoute("/api/bookmarks")({
  POST: async ({ request, params }) => {
    try {
      const newBookmarks: Bookmark[] = await request.json();

      const response = await getBookmarksFromDB();
      const _id = response?._id;
      
      if (_id) {
        const bookmarksInDB: Bookmark[] = response.bookmarks;
        const bookmarks = newBookmarks.map((bookmark: Bookmark) => {
          const existing = bookmarksInDB.find((b) => b.id === bookmark.id);
          if (existing) {
            return {
              ...bookmark,
              createdAt: existing.createdAt,
              consumed: existing.consumed,
              hearable: bookmark.hearable || isHearable(bookmark.url)
            };
          } else {
            return {
              ...bookmark,
              createdAt: new Date().getTime(),
              consumed: false,
              hearable: isHearable(bookmark.url)
            };
          }
        });
        await updateBookmarkInDB(_id, Array.from(bookmarks));
      } else {
        const bookmarks = newBookmarks.map((bookmark) => ({
          ...bookmark,
          createdAt: new Date().getTime(),
          consumed: false,
          hearable: isHearable(bookmark.url)
        }));
        await postBookmarksToDB(bookmarks);
      }

      setHeaders({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      setResponseStatus(200);
      return json({ ok: true, message: "Bookmarks added", status: 200 });
    } catch (error) {
      console.log(error);
      setResponseStatus(500);
      return json({ error: error.message });
    }
  },

  GET: async ({ request, params }) => {
    try {
      const { bookmarks } = await getBookmarksFromDB();
      setResponseStatus(200);
      return json(bookmarks);
    } catch (error) {
      setResponseStatus(500);
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

      const { bookmarks, _id } = response;

      const updatedBookmarks = bookmarks.map((b) => {
        if (b.id === bookmark.id) {
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
      return json({ ok: true, message: "Bookmark updated", status: 200 });
    } catch (error) {
      setResponseStatus(500);
      return json({ error: error.message, status: 500 });
    }
  },
});
