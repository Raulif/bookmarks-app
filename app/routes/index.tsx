import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";

import { api } from "../../convex/_generated/api";
import { ListItem } from "../components/ListItem";
import { SortingSelect } from "../components/SortingSelect";
import { updateBookmark } from "../lib/bookmarks-crud";
import { hearArticle } from "../lib/hearArticle";
import { sortByConsumed, sortByDateAdded } from "../lib/helpers";
import { Bookmark } from "../types/bookmark";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(convexQuery(api.bookmarks.get, {}));
  const [sorting, setSorting] = useState("no-sorting");

  const bookmarks: Bookmark[] = useMemo(() => {
    const dataBookmarks = [...data.bookmarks];
    if (dataBookmarks.length) return dataBookmarks.sort(sortByDateAdded);
    return [];
  }, [data]);

  const onCheckboxChange = useCallback(updateBookmark, []);

  const onHearClick = useCallback(
    async (id: string) => {
      const url = bookmarks.find((bookmark: any) => bookmark.id === id)?.url;
      if (!url) return;
      await hearArticle(url);
    },
    [bookmarks]
  );

  const onSelectChange = useCallback((value: string) => {
    setSorting(value);
  }, []);

  const sortedBookmarks = useMemo(() => {
    if (sorting === "consumed") {
      return [...bookmarks].sort(sortByConsumed);
    } else {
      return bookmarks;
    }
  }, [sorting]);

  return (
    <div className="outer-container">
      <h1 className="headline lora-bold">
        {bookmarks.length ? "Bookmarked Articles" : "No bookmarked articles"}
      </h1>
      <p className="counter lora-regular-italic">[{bookmarks.length} links]</p>
      <div>
        <SortingSelect value={sorting} onSelectChange={onSelectChange} />
      </div>
      <div className="lora-bold read">Consumed</div>
      <ul className="list">
        {sortedBookmarks?.map((bookmark, index) => (
          <ListItem
            key={bookmark.id}
            id={bookmark.id}
            onCheckboxChange={onCheckboxChange}
            number={index + 1}
            date={bookmark.dateAdded}
            consumed={bookmark.consumed}
            url={bookmark.url}
            title={bookmark.title}
            onHearClick={onHearClick}
          />
        ))}
      </ul>
    </div>
  );
}
