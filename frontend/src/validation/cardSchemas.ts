import { z } from "zod";

export const cardSchema = z.object({
  word: z
    .string()
    .nonempty("errors.wordRequired")
    .refine((val) => val.trim().length > 0, {
      message: "errors.wordNotSpaces",
    }),
  translation: z
    .string()
    .nonempty("errors.translationRequired")
    .refine((val) => val.trim().length > 0, {
      message: "errors.translationNotSpaces",
    }),
  deckId: z.string().nonempty("errors.deckRequired"),
  remember: z.boolean(),
});

export type CardFormData = z.infer<typeof cardSchema>;
