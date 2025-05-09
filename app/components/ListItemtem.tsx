import { useState, useCallback, useMemo } from "react";
import type { Bookmark } from "../types/bookmark";
import { formatDate, isHearable } from "../lib/helpers";

type ListItemProps = {
  id: Bookmark["id"];
  date: number;
  consumed: Bookmark["consumed"];
  url: Bookmark["url"];
  title: Bookmark["title"];
  onCheckboxChange: (id: Bookmark["id"], isChecked: boolean) => void;
  onHearClick: (id: Bookmark["id"]) => void;
  number: number;
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
}: ListItemProps) => {
  const [isChecked, setIsChecked] = useState(consumed);
  const [isPlaying, setIsPlaying] = useState(false);

  const hearable = useMemo(() => isHearable(url), [url]);

  const onChange = useCallback(() => {
    setIsChecked(!isChecked);
    onCheckboxChange(id, !isChecked);
  }, [onCheckboxChange, isChecked]);

  const onStopClick = useCallback(() => {
    setIsPlaying(false);
    window.speechSynthesis.cancel();
  }, []);

  const onHear = useCallback(() => {
    setIsPlaying(true);
    onHearClick(id);
  }, [id]);

  return (
    <li key={id} className={`list-item ${isChecked ? "consumed" : ""}`}>
      <div className="item-content">
        <p className="date-added lora-regular-italic">{formatDate(date)}</p>
        <div className="item-inner-content">
          <span className="item-number">{number}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="lora-regular"
          >
            {title}
          </a>
        </div>
        {hearable && (
          <div className="actions">
            {isPlaying ? (
              <button className="stop" onClick={() => onStopClick()}>
                Stop
              </button>
            ) : (
              <button className="hear" onClick={onHear}>
                Hear
              </button>
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
