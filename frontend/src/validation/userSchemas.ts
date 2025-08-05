import { z } from "zod";

// Base schema shared between forms
const baseUserSchema = z.object({
  name: z
    .string()
    .min(4, "Username has to be longer than 3 letters")
    .nonempty("That field is required"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("That field is required"),
  password: z.string(),
  confirmPassword: z.string(),
});

// Schema for profile update (password optional) - cant use .min or .regex because those would run even when the value is undefined
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
          message:
            "Password must be at least 8 characters, contain an uppercase letter and a number",
        }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Schema for registration (password required)
export const userRegisterSchema = baseUserSchema
  .extend({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Types
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type UserRegisterFormData = z.infer<typeof userRegisterSchema>;
