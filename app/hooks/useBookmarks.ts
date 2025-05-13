import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Bookmark } from "../types/bookmark";
import { sortByConsumed, sortByDateAdded } from "../lib/helpers";

export const useBookmarks = () => {
  const { data } = useSuspenseQuery(convexQuery(api.bookmarks.get, {}));
  const [sorting, setSorting] = useState("no-sorting");

  const bookmarks: Bookmark[] = useMemo(() => {
    const dataBookmarks = [...data.bookmarks];
    if (dataBookmarks.length) return dataBookmarks.sort(sortByDateAdded);
    return [];
  }, [data]);

  const sortedBookmarks = useMemo(() => {
    if (sorting === "consumed") {
      return [...bookmarks].sort(sortByConsumed);
    } else {
      return bookmarks;
    }
  }, [sorting, bookmarks]);

  return {
    setSorting, sorting, bookmarks, sortedBookmarks
  }
};
