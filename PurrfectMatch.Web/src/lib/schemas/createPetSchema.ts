import { z } from "zod";

export const createPetSchema = z.object({
  shelterId: z.number().positive("Shelter ID is required"),
  
  // Pet identification
  name: z.string()
    .min(1, "Pet name is required")
    .max(100, "Pet name must be less than 100 characters"),
  
  age: z.string()
    .min(1, "Age is required")
    .max(50, "Age description must be less than 50 characters"),
  
  gender: z.string()
    .min(1, "Gender is required"),
  
  size: z.string()
    .min(1, "Size is required"),
  
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  
  // Optional attributes - can use existing IDs or create new ones
  speciesId: z.number().optional(),
  species: z.string().optional(),
  
  breedId: z.number().optional(),
  breed: z.string().optional(),
  
  activityLevelId: z.number().optional(),
  activityLevel: z.string().optional(),
  
  healthStatusId: z.number().optional(),
  healthStatus: z.string().optional(),
  
  colorId: z.number().optional(),
  color: z.string().optional(),
  
  coatLengthId: z.number().optional(),
  coatLength: z.string().optional(),
  
  microchipped: z.boolean().optional(),
}).refine((data) => {
  // Either speciesId or species name must be provided
  return data.speciesId || (data.species && data.species.trim().length > 0);
}, {
  message: "Please select or enter a species",
  path: ["species"]
}).refine((data) => {
  // Either breedId or breed name must be provided
  return data.breedId || (data.breed && data.breed.trim().length > 0);
}, {
  message: "Please select or enter a breed",
  path: ["breed"]
});

export type CreatePetSchema = z.infer<typeof createPetSchema>;
