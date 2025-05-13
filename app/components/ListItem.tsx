import { useState, useCallback, useMemo } from "react";
import type { Bookmark } from "../types/bookmark";
import { formatDate, isHearable } from "../lib/helpers";
import { useSpeachStore } from "../store/useSpeechStore";

type ListItemProps = {
  id: Bookmark["id"];
  date: number;
  consumed: Bookmark["consumed"];
  url: Bookmark["url"];
  title: Bookmark["title"];
  onCheckboxChange: (id: Bookmark["id"], isChecked: boolean) => void;
  onHearClick: (id: Bookmark["id"]) => void;
  number: number;
  onStop: () => void;
  onCancel: () => void;
};

export const ListItem = ({
  id,
  onCheckboxChange,
  number,
  date,
  consumed,
  url,
  title,
  onHearClick,
  onStop,
  onCancel,
}: ListItemProps) => {
  const [isChecked, setIsChecked] = useState(consumed);
  const { gettingText, speaking, currentTrackId } = useSpeachStore();
  const hearable = useMemo(() => isHearable(url), [url]);

  const onChange = useCallback(() => {
    setIsChecked(!isChecked);
    onCheckboxChange(id, !isChecked);
  }, [onCheckboxChange, isChecked]);

  const currentItem = useMemo(
    () => currentTrackId === id,
    [currentTrackId, id]
  );
  const playingItem = useMemo(
    () => currentItem && speaking,
    [currentItem, speaking]
  );
  const loadingItem = useMemo(
    () => currentItem && gettingText,
    [currentItem, gettingText]
  );

  return (
    <li
      key={id}
      className={`list-item  ${playingItem ? "playing" : ""} ${isChecked ? "consumed" : ""}`}
    >
      <div className="item-content">
        <p className="date-added lora-regular-italic">{formatDate(date)}</p>
        <div className="item-inner-content">
          {playingItem && <span>PLAYING: </span>}
          <span className="item-number">{number}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`lora-regular title`}
          >
            {title}
          </a>
        </div>
        {hearable && (
          <div className="actions">
            <button
              className={`
               lora-regular ${loadingItem ? "loading" : playingItem ? "stop" : "hear"}
              `}
              onClick={
                loadingItem
                  ? onCancel
                  : playingItem
                    ? onStop
                    : () => onHearClick(id)
              }
            >
              {!currentItem
                ? "Hear"
                : playingItem
                  ? "Stop"
                  : gettingText
                    ? "Cancel"
                    : "Hear"}
            </button>
            {loadingItem && (
              <span className="spinner-container lora-bold">
                <span className="spinner"></span> Loading ...
              </span>
            )}
          </div>
        )}
      </div>
      <div className="checkbox-container">
        <input
          type="checkbox"
          title="Consumed"
          checked={isChecked}
          onChange={onChange}
        />
      </div>
    </li>
  );
};
