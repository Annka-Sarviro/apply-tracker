import { z } from "zod";

export const getEventSchema = () => {
  return z.object({
    soonEventName: z
      .string()
      .min(1, "soonSection.soonModalNameLength")
      .max(50, "soonSection.soonModalNameLength"),
    soonEventNotes: z
      .string()
      .max(1000, "soonSection.soonModalNotes")
      .optional(),
    date: z
      .string()
      .refine(
        (date) => {
          const selectedDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        },
        {
          message: "soonSection.invalidPastDate",
        }
      )
      .optional(),
    hours: z
      .union([z.string(), z.number()])
      // .transform((val) => Number(val)) // Перетворюємо в число
      .transform((val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        return Number(val);
      })
      .refine(
        (val) =>
          val !== undefined &&
          typeof val === "number" &&
          !isNaN(val) &&
          val >= 0 &&
          val <= 23,
        {
          message: "soonSection.invalidHours",
        }
      ),
    minutes: z
      .union([z.string(), z.number()])
      .transform((val) => Number(val))
      .refine((val) => val >= 0 && val <= 59, {
        message: "soonSection.invalidMinutes",
      })
      .optional()
      .default(0),
  });
};
