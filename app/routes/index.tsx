import {
  convexQuery,
  useConvexMutation,
  useConvexQuery,
} from "@convex-dev/react-query";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { api } from "../../convex/_generated/api";
import { use } from "react";

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

  const onClick = () => {
    mutate({ bookmarks: "test" });
  };

  return (
    <div>
      <button onClick={onClick}>Button</button>
      {isPending ? <p>Loading...</p> : <p>Done</p>}
    </div>
  );
}
