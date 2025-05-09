import type { Bookmark } from "../types/bookmark";
export const updateBookmark = async (id: Bookmark["id"], checked: boolean) => {
  return await fetch("api/bookmarks", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, consumed: checked }),
  });
};
