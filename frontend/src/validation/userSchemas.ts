import { z } from "zod";

const baseUserSchema = z.object({
  name: z
    .string()
    .min(4, "errors.usernameTooShort")
    .nonempty("errors.required"),
  email: z.string().email("errors.invalidEmail").nonempty("errors.required"),
  password: z.string(),
  confirmPassword: z.string(),
});

export const userProfileSchema = baseUserSchema
  .extend({
    password: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val === "" ||
          (val.length >= 8 && /[A-Z]/.test(val) && /\d/.test(val)),
        {
          message: "errors.passwordComplexity",
        }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "errors.passwordsDontMatch",
    path: ["confirmPassword"],
  });

// Schema for registration (password required)

export const userRegisterSchema = baseUserSchema
  .extend({
    password: z
      .string()
      .min(8, "errors.passwordTooShort")
      .regex(/[A-Z]/, "errors.passwordUppercase")
      .regex(/\d/, "errors.passwordNumber"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "errors.passwordsDontMatch",
    path: ["confirmPassword"],
  });

// Types
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type UserRegisterFormData = z.infer<typeof userRegisterSchema>;
