import { useState, useCallback, useMemo } from 'react';
import type { Bookmark } from '../types/bookmark';
import { formatDate, isHearable } from '../lib/helpers';
import { useSpeachStore } from '../store/useSpeechStore';

type ListItemProps = {
  dateAdded: number;
  onCheckboxChange: (id: Bookmark['id'], isChecked: boolean) => void;
  onHearClick: (id: Bookmark['id']) => void;
  number: number;
  onStop: () => void;
  onCancel: () => void;
} & Partial<Bookmark>;

export const ListItem = ({
  id,
  onCheckboxChange,
  number,
  dateAdded,
  consumed,
  url,
  title,
  onHearClick,
  onStop,
  onCancel,
  hearable
}: ListItemProps) => {
  const [isChecked, setIsChecked] = useState(consumed);
  const { gettingText, speaking, currentTrackId } = useSpeachStore();

  const onChange = useCallback(() => {
    if (!id) return;
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

  if (!id) return null;

  return (
    <li
      key={id}
      className={`list-item  ${playingItem ? 'playing' : ''} ${isChecked ? 'consumed' : ''}`}
    >
      <div className='item-content'>
        <p className='date-added lora-regular-italic'>{formatDate(dateAdded)}</p>
        <div className='item-inner-content'>
          {playingItem && <span>PLAYING: </span>}
          <span className='item-number'>{number}</span>
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className={`lora-regular title`}
          >
            {title}
          </a>
        </div>
        {hearable && (
          <div className='actions'>
            <button
              className={`
               lora-regular ${loadingItem ? 'loading' : playingItem ? 'stop' : 'hear'}
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
                ? 'Hear'
                : playingItem
                  ? 'Stop'
                  : gettingText
                    ? 'Cancel'
                    : 'Hear'}
            </button>
            {loadingItem && (
              <span className='spinner-container lora-bold'>
                <span className='spinner'></span> Loading ...
              </span>
            )}
          </div>
        )}
      </div>
      <div className='checkbox-container'>
        <input
          type='checkbox'
          title='Consumed'
          checked={isChecked}
          onChange={onChange}
        />
      </div>
    </li>
  );
};
