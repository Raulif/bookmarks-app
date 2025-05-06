import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const convexDeploymentUrl = `${process.env.VITE_CONVEX_URL}`;
const convex = new ConvexHttpClient(convexDeploymentUrl);

export const postBookmarksToDB = async (bookmarks: any) =>
  await convex.mutation(api.bookmarks.post, { bookmarks });

export const getBookmarksFromDB = async () =>
  await convex.query(api.bookmarks.get, {});

export const updateBookmarkInDB = async (id, bookmarks) => 
  await convex.mutation(api.bookmarks.put, { id, bookmarks });