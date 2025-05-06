import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../convex/_generated/api";

import { useCallback, useMemo } from "react";
import { ListItem } from "../components/ListItemtem";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(convexQuery(api.bookmarks.get, {}));

  const bookmarks = useMemo(
    () =>
      data?.bookmarks?.length
        ? data.bookmarks.sort((a, b) => a.dateAdded - b.dateAdded)
        : [],
    [data]
  );

  const formatDate = (date: number) =>
    new Date(date).toLocaleString("de", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  const onCheckboxChange = useCallback((id: string, checked: boolean) => {
    fetch("api/bookmarks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, consumed: checked }),
    });
  }, []);

  return (
    <div className="outer-container">
      <h1 className="headline lora-bold">
        {bookmarks.length ? "Bookmarked Articles" : "No bookmarked articles"}
      </h1>
      <div className="lora-bold read">Read</div>
      <ul className="list">
        {bookmarks?.map((bookmark: any, index) => (
          <ListItem
            key={bookmark.bookmarkId}
            bookmarkId={bookmark.bookmarkId}
            onCheckboxChange={onCheckboxChange}
            number={index + 1}
            date={formatDate(bookmark.dateAdded)}
            consumed={bookmark.consumed}
            url={bookmark.url}
            title={bookmark.title}
          />
        ))}
      </ul>
    </div>
  );
}
