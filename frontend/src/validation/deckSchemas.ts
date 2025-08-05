import { z } from "zod";

export const deckSchema = z.object({
  name: z
    .string()
    .nonempty("Deck name is required")
    .refine((val) => val.trim().length > 0, {
      message: "Deck name cannot be just spaces",
    }),
  sourceLng: z.string().nonempty("Source language is required"),
  targetLng: z.string().nonempty("Target language is required"),
  description: z.string().optional(),
});

export type DeckFormData = z.infer<typeof deckSchema>;
