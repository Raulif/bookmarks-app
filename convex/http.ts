import { httpRouter } from "convex/server";
import { getBookmarks, addBookmarks } from "./httpActions";

const http = httpRouter();

http.route({
  path: '/bookmarks',
  method: 'GET',
  handler: getBookmarks,
})

http.route({
  path: '/bookmarks',
  method: 'POST',
  handler: addBookmarks,
})

export default http;