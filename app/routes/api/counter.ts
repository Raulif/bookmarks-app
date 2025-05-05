import { createAPIFileRoute } from '@tanstack/react-start/api';
import { json } from '@tanstack/react-start';
import { useQuery } from '@tanstack/react-query';
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

const baseConvexUrl = `https://${process.env.CONVEX_DEPLOYMENT_NAME}.convex.site`;
export const APIRoute = createAPIFileRoute('/api/counter')({
  GET: async () => {

    try {
      const response = await fetch(`${baseConvexUrl}/getTasks`)
      return json({ tasks: await response.json() }, { status: 200 });
    } catch (error) {
      return json({ error: error.message }, { status: 500 });
    }
  }
});