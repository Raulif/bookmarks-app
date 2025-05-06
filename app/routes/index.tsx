import {
  convexQuery,
  useConvexMutation,
  useConvexQuery,
} from "@convex-dev/react-query";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { api } from "../../convex/_generated/api";
import { testData } from "../../test";
import { BASE_CONVEX_URL } from "../constants";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.bookmarks.post),
  });

  const { data: bookmarks } = useSuspenseQuery(
    convexQuery(api.bookmarks.get, {})
  );
  console.log(bookmarks);
  console.log(BASE_CONVEX_URL)
  const onClick = async () => {
    try {
      const res = await fetch(`${BASE_CONVEX_URL}/bookmarks`, {
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
      <button onClick={onClick}>Button</button>
      {isPending ? <p>Loading...</p> : <p>Done</p>}
    </div>
  );
}
