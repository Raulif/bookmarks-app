import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

export const addBookmarks = httpAction(async (ctx, request) => {
  const { body } = await request.json();
  await ctx.runMutation(api.bookmarks.post, body);
  return new Response(null, { status: 200 });
});

export const getBookmarks = httpAction(async (ctx, request) => {
  const bookmarks = await ctx.runQuery(api.bookmarks.get);
  return new Response(JSON.stringify(bookmarks), {
    headers: {
      "content-type": "application/json",
    },
    status: 200,
  });
});