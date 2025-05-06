import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

export const addBookmarks = httpAction(async (ctx, request) => {
  const res = await request.json();
  console.log("body", res);
  await ctx.runMutation(api.bookmarks.post, { bookmarks: JSON.stringify(res) });
  return new Response(null, { status: 200 });
});

export const getBookmarks = httpAction(async (ctx, request) => {
  const bookmarks = await ctx.runQuery(api.bookmarks.get);
  return new Response(JSON.stringify(bookmarks), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    status: 200,
  });
});


export const options = httpAction(async (ctx, request) => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    status: 200,
  });
});