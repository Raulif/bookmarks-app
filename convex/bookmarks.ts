import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const post = mutation({
  args: {
    bookmarks: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookmarks", { bookmarks: args.bookmarks });
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bookmarks").collect();
  },
});
