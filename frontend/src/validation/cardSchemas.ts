import { z } from "zod";

export const cardSchema = z.object({
  word: z
    .string()
    .nonempty("Word is required")
    .refine((val) => val.trim().length > 0, {
      message: "Word cannot be just spaces",
    }),
  translation: z
    .string()
    .nonempty("Translation is required")
    .refine((val) => val.trim().length > 0, {
      message: "Translation cannot be just spaces",
    }),
  deckId: z.string().nonempty("Deck is required"),
  remember: z.boolean(),
});

export type CardFormData = z.infer<typeof cardSchema>;
