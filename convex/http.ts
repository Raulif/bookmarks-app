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
  method: 'OPTIONS',
  handler: options
})

http.route({
  path: '/bookmarks',
  method: 'POST',
  handler: addBookmarks,
})


export default http;