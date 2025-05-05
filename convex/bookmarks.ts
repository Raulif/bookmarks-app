import { v } from "convex/values";
import {mutation, query } from "./_generated/server";

export const post = mutation({
  args: {
    bookmarks: v.string()
  },
  handler: async (ctx, { bookmarks }) => {
    return await ctx.db.insert("bookmarks", {bookmarks});
  }
})

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bookmarks").collect();
  },
})