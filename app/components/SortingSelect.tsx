import { useCallback, useEffect } from "react";

export const SortingSelect = ({ value, onSelectChange }) => {
  const onChange = useCallback((e) => {
    const selectedSorting = e.target.value;
    onSelectChange(selectedSorting);
    localStorage.setItem("stored-sorting", selectedSorting);
  }, []);

  useEffect(() => {
    const storedSorting = localStorage.getItem("stored-sorting");
    if (storedSorting) onSelectChange(storedSorting);
  }, []);

  return (
    <form className="sort lora-regular">
      <label>Sort by:</label>
      <select
        value={value}
        onChange={onChange}
        id="sort-items-select"
        name="sort-items"
      >
        <option value="no-sorting">Date</option>
        <option value="consumed">Consumed</option>
      </select>
    </form>
  );
};
