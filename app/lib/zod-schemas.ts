import z from "zod";

export const SearchSchema = z.object({
  q: z.string().min(1, "You have to enter a search term."),
});

export type SearchSchema = z.infer<typeof SearchSchema>;
