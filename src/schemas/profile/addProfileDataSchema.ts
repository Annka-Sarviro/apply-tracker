import { PropsModalAddProperties } from "@/components/modal/components/profileModals/modalAddProperties.types";
import { z, ZodTypeAny } from "zod";

type Schema = {
  [K in PropsModalAddProperties["cardsType"]]: ZodTypeAny;
};

export const addProfileData: Schema = {
  addResumes: z.object({
    name: z
      .string()
      .min(2, {
        message: "validation.min2Characters",
      })
      .max(50, { message: "validation.max50Characters" })
      .trim(),
    link: z
      .string()
      .regex(/^https?:\/\/[a-zA-Z0-9-]{1,}(\.[a-zA-Z0-9-]{2,})+(\/[^\s]*)?$/, {
        message: "validation.invalidUrl",
      })
      .trim(),
  }),

  addProjects: z.object({
    name: z
      .string()
      .min(2, { message: "validation.min2Characters" })
      .max(50, { message: "validation.max50Characters" })
      .trim(),
    technologies: z
      .string()
      .trim()
      .min(2, { message: "validation.min2Characters" }),
    link: z
      .string()
      .regex(/^https?:\/\/[a-zA-Z0-9-]{1,}(\.[a-zA-Z0-9-]{2,})+(\/[^\s]*)?$/, {
        message: "validation.invalidUrl",
      })
      .trim(),
    text: z.string().min(2, { message: "validation.min2Characters" }).trim(),
  }),
  addCoverLetters: z.object({
    name: z
      .string()
      .min(2, { message: "validation.min2Characters" })
      .max(50, { message: "validation.max50Characters" })
      .trim(),
    text: z.string().trim().min(2, { message: "validation.min2Characters" }),
  }),
  addPersonalProperties: z.object({
    name: z
      .string()
      .min(2, { message: "validation.min2Characters" })
      .max(50, { message: "validation.max50Characters" })
      .trim(),

    link: z
      .string()
      .trim()
      .regex(/^https?:\/\/[a-zA-Z0-9-]{1,}(\.[a-zA-Z0-9-]{2,})+(\/[^\s]*)?$/, {
        message: "validation.invalidUrl",
      }),
  }),
};
