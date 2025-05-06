import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../convex/_generated/api";
import { testData } from "../../test";
import { useCallback, useMemo } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(convexQuery(api.bookmarks.get, {}));
  console.log(data);
  const onClick = async () => {
    try {
      const res = await fetch("api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });
      console.log(res);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const bookmarks = useMemo(
    () =>
      data.length
        ? data[0].bookmarks.sort((a, b) => a.dateAdded - b.dateAdded)
        : [],
    []
  );

  const formatDate = (date: number) =>
    new Date(date).toLocaleString("de", {
      year: "numeric",
      month: "2-digit",
      day: "numeric",
    });

  const onCheckboxChange = useCallback((event) => {
    const input = event.target as HTMLInputElement;
    const { checked } = input;
    const id = input.dataset.id;
    fetch("api/bookmarks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, consumed: checked }),
    });
  }, []);

  return (
    <div className="px-10 py-4">
      <h1 className="text-5xl mb-12">Bookmarked Articles</h1>
      <ul className="flex flex-col gap-2">
        {bookmarks?.map((bookmark: any, index) => (
          <li
            key={bookmark.bookmarkId}
            className="flex justify-between items-start"
          >
            <div className="flex gap-1 flex-col">
              <p className="text-sm">{formatDate(bookmark.dateAdded)}</p>
              <div className="flex gap-2">
                <span>{index + 1}</span>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  {bookmark.title}
                </a>
              </div>
            </div>
            <input
              data-id={bookmark.bookmarkId}
              type="checkbox"
              checked={bookmark.consumed}
              onChange={onCheckboxChange}
            />
          </li>
        ))}
      </ul>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={onClick}
      >
        Add Bookmarks
      </button>
    </div>
  );
}
