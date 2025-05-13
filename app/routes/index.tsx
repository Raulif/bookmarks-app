import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";

import { ListItem } from "../components/ListItem";
import { SortingSelect } from "../components/SortingSelect";
import { updateBookmark } from "../lib/bookmarks-crud";
import { useSpeachStore } from "../store/useSpeechStore";
import { useSpeechManager } from "../hooks/useSpeechManager";
import { useBookmarks } from "../hooks/useBookmarks";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { onCancelClick, onHearClick, onStopClick } = useSpeechManager();
  const { sortedBookmarks, sorting, setSorting, bookmarks } = useBookmarks();
  const { speaking } = useSpeachStore();

  const onCheckboxChange = useCallback(updateBookmark, []);

  const onSelectChange = useCallback((value: string) => {
    setSorting(value);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("../lib/serviceWorker.ts")
          .then((registration) => {
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration
            );
          })
          .catch((err) => {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }
  }, []);

  return (
    <div className="outer-container">
      <div className="headline-container">
        <h1 className={"headline lora-bold"}>
          {bookmarks?.length ? "Bookmarked Articles" : "No bookmarked articles"}
        </h1>
        {speaking && (
          <button onClick={onCancelClick} className="speak-cancel lora-bold">
            Stop
          </button>
        )}
      </div>
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
            onStop={onStopClick}
            onCancel={onCancelClick}
          />
        ))}
      </ul>
    </div>
  );
}
