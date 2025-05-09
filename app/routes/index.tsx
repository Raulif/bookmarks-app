import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../convex/_generated/api";

import { useCallback, useMemo } from "react";
import { ListItem } from "../components/ListItemtem";
import { hearArticle } from "../lib/hearArticle";
import { Bookmark } from "../types/bookmark";
import { updateBookmark } from "../lib/bookmarks-crud";
import { sortByDateAdded } from "../lib/helpers";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(convexQuery(api.bookmarks.get, {}));

  const bookmarks: Bookmark[] = useMemo(
    () =>
      data?.bookmarks?.length
        ? data.bookmarks.sort(sortByDateAdded)
        : [],
    [data]
  );

  const onCheckboxChange = useCallback(updateBookmark, []);

  const onHearClick = useCallback(async (id: string) => {
    const url = bookmarks.find((bookmark: any) => bookmark.bookmarkId === id)?.url;
    if (!url) return;
    await hearArticle(url)
  }, [bookmarks])


  return (
    <div className="outer-container">
      <h1 className="headline lora-bold">
        {bookmarks.length ? "Bookmarked Articles" : "No bookmarked articles"}
      </h1>
      <p className="counter lora-regular-italic">[{bookmarks.length} articles]</p>
      <div className="lora-bold read">Done</div>
      <ul className="list">
        {bookmarks?.map((bookmark, index) => (
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
