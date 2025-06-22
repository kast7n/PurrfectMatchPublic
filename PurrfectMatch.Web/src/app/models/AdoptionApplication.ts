export enum ApplicationStatusDto {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  Withdrawn = "Withdrawn",
}

export interface AdoptionApplicationDto {
  id: number;
  userId: string;
  petId: number;
  status: ApplicationStatusDto;
  createdAt: string; // ISO date string
  // Extended fields that might be populated by joins or separate queries
  petName?: string;
  shelterName?: string;
}

// Create DTO for creating adoption applications
export interface CreateAdoptionApplicationDto {
  UserId: string; // Match backend property name exactly
  PetId: number;
}

// export interface UpdateAdoptionApplicationStatusDto {
//  status: ApplicationStatusDto;
//  adminNotes?: string;
// }
