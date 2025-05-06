import { useState, useCallback } from "react";

export const ListItem = ({
  bookmarkId,
  onCheckboxChange,
  number,
  date,
  consumed,
  url,
  title,
}) => {
  const [isChecked, setIsChecked] = useState(consumed);

  const onChange = useCallback(() => {
    setIsChecked(!isChecked);
    onCheckboxChange(bookmarkId, !isChecked);
  }, [onCheckboxChange, isChecked]);
  
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
      </div>
      <div className="checkbox-container">
        <input type="checkbox" title="Read it!" checked={isChecked} onChange={onChange} />
      </div>
    </li>
  );
};
