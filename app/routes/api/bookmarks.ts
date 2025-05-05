import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { BASE_CONVEX_URL } from "../../constants";
export const APIRoute = createAPIFileRoute("/api/bookmarks")({
  POST: async ({ request, params }) => {
    try {
      const bookmarks = await request.json();
      return json(
        { message: "test" },
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
      // const response = await fetch(`${BASE_CONVEX_URL}/bookmarks`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(bookmarks),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to add bookmarks");
      // }

      // return json(
      //   { message: "Bookmarks added successfully" },
      //   {
      //     status: 200,
      //   }
      // );
    } catch (error) {
      return json({ error: error.message }, { status: 500 });
    }
  },

  GET: async ({ request, params }) => {
    try {
      const response = await fetch(`${BASE_CONVEX_URL}/bookmarks`);

      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
      }

      const bookmarks = await response.json();
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
