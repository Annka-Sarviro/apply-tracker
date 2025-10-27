import { z } from "zod";

export const userDataSchema = z.object({
  username: z.string(),
  email: z.string(),
  phone: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === undefined || value === "" || /^\+?\d{10,14}$/.test(value),
      { message: "validation.phoneNumberInvalid" }
    ),
});
