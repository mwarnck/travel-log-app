import z from "zod";

import defineAuthenticatedEventHandler from "../utils/define-authenticated-event-handler";
import sendZodError from "../utils/send-zod-error";

const searchSchema = z.object({
  q: z.string().min(1),
});

export default defineAuthenticatedEventHandler(
  defineCachedEventHandler(async (event) => {
    const result = await getValidatedQuery(event, searchSchema.safeParse);

    if (!result.success) {
      return sendZodError(event, result.error);
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${result.data.q}&format=json`, {
        signal: AbortSignal.timeout(5000),
        headers: {
          "User-Agent": "travel-log-app | Github mwarnck",
        },
      });

      if (!response.ok) {
        return sendError(event, createError({
          statusCode: 504,
          statusMessage: "Unable to reach search API",
        }));
      }

      const search = await response.json();
      return search;
    }
    catch {
      return sendError(event, createError({
        statusCode: 504,
        statusMessage: "Unable to reach search API",
      }));
    }
  }, {
    maxAge: 60 * 60 * 24,
    name: "search-nominatim",
    getKey: async (event) => {
      const query = await getQuery(event);
      return query.q?.toString() || "";
    },
  }),
);
