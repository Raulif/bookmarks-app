import { useState, useCallback } from "react";

export const ListItem = ({
  bookmarkId,
  onCheckboxChange,
  number,
  date,
  consumed,
  url,
  title,
  onHearClick,
}) => {
  const [isChecked, setIsChecked] = useState(consumed);
  const [isPlaying, setIsPlaying] = useState(false);

  const onChange = useCallback(() => {
    setIsChecked(!isChecked);
    onCheckboxChange(bookmarkId, !isChecked);
  }, [onCheckboxChange, isChecked]);

  const onStopClick = useCallback(() => {
    setIsPlaying(false);
    window.speechSynthesis.cancel();
  }, []);

  const onHear = useCallback((bookmarkId) => {
    setIsPlaying(true)
    onHearClick(bookmarkId);
  }, [])

  return (
    <li key={bookmarkId} className={`list-item ${isChecked ? "consumed" : ""}`}>
      <div className="item-content">
        <p className="date-added lora-regular-italic">{date}</p>
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
        <div className="actions">
          {isPlaying ? (
            <button className="stop" onClick={() => onStopClick()}>
              Stop
            </button>
          ) : (
            <button
              className="hear"
              onClick={() => onHear(bookmarkId)}
            >
              Hear
            </button>
          )}
          <a href={url} target="_blank" rel="noopener noreferrer">
            Visit
          </a>
        </div>
      </div>
      <div className="checkbox-container">
        <input
          type="checkbox"
          title="Read it!"
          checked={isChecked}
          onChange={onChange}
        />
      </div>
    </li>
  );
};
