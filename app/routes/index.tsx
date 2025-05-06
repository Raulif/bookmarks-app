import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../convex/_generated/api";
import { testData } from "../../test";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(
    convexQuery(api.bookmarks.get, {})
  );
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

  return (
    <div>
      <h1>Bookmarks</h1>
      <button onClick={onClick}>Add Bookmarks</button>
      <ul>
        {data?.bookmarks?.map((bookmark: any) => (
          <li key={bookmark.id}>
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
              {bookmark.title}
            </a>
            <p>{bookmark.description}</p>
            <p>{bookmark.createdAt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
