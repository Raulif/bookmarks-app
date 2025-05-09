export const sortByDateAdded = (a, b) => a.dateAdded - b.dateAdded;

export const formatDate = (date: number) =>
  new Date(date).toLocaleString("de", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
