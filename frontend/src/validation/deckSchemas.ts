import { z } from "zod";

export const deckSchema = z.object({
  name: z
    .string()
    .nonempty("errors.deckNameRequired")
    .refine((val) => val.trim().length > 0, {
      message: "errors.deckNameNotSpaces",
    }),
  sourceLng: z.string().nonempty("errors.srcLngRequired"),
  targetLng: z.string().nonempty("errors.trgLngRequired"),
  description: z.string().optional(),
});

export type DeckFormData = z.infer<typeof deckSchema>;
