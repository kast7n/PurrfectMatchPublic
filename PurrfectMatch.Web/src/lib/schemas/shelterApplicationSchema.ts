import { z } from "zod";

export const shelterApplicationSchema = z.object({
  shelterName: z
    .string()
    .min(1, "Shelter name is required")
    .max(255, "Shelter name cannot exceed 255 characters"),
  
  address: z.object({
    street: z
      .string()
      .min(1, "Street address is required")
      .max(255, "Street address cannot exceed 255 characters"),
    city: z
      .string()
      .min(1, "City is required")
      .max(100, "City cannot exceed 100 characters"),
    state: z
      .string()
      .min(1, "State/Province is required")
      .max(100, "State/Province cannot exceed 100 characters"),
    postalCode: z
      .string()
      .min(1, "Postal code is required")
      .max(20, "Postal code cannot exceed 20 characters"),
    country: z
      .string()
      .min(1, "Country is required")
      .max(100, "Country cannot exceed 100 characters"),
  }),
  
  remarks: z
    .string()
    .max(500, "Remarks cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export type ShelterApplicationSchema = z.infer<typeof shelterApplicationSchema>;
