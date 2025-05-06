import { httpRouter } from "convex/server";
import { getBookmarks, addBookmarks, options } from "./httpActions";

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

http.route({
  path: '/bookmarks',
  method: 'OPTIONS',
  handler: options
})

export default http;