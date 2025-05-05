import { httpRouter } from "convex/server";
import { getTasks, getBookmarks, addBookmarks } from "./httpActions";

const http = httpRouter();

http.route({
  path: '/getTasks',
  method: 'GET',
  handler: getTasks,
})

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