export interface Pet {
  petId: number; // Changed from id to petId to match new API
  name: string;
  speciesName: string;
  breedName?: string;
  age?: string; // Changed from number to string to match PetDto.cs
  gender?: string;
  size?: string; // Added from PetDto.cs
  coatLength?: string; // Corrected from coatLengthName
  color?: string; // Corrected from colorName
  activityLevel?: string; // Corrected from activityLevelName
  healthStatus?: string; // Corrected from healthStatusName
  description?: string;
  photoUrls: string[]; // Changed from images: PetImageDto[]
  shelterId: number; // Made required since it should always be present
  shelterName?: string; // Added from PetDto.cs
  isAdopted: boolean;
  isDeleted?: boolean; // Added from PetDto.cs
  createdAt?: string; // Added from PetDto.cs
}

// Pet Filter DTO matching the C# PetFilterDto
export interface PetFilterDto {
  // Basic Filters
  name?: string;
  speciesId?: number;
  breedId?: number;
  size?: string;
  age?: string;
  gender?: string;

  // Advanced Attributes
  coatLengthId?: number;
  colorId?: number;
  activityLevelId?: number;
  healthStatusId?: number;

  // Boolean Flags
  microchipped?: boolean;
  isAdopted?: boolean;
  isDeleted?: boolean;

  // Location/Shelter
  shelterId?: number;
  shelterName?: string;
  city?: string;
  radiusKm?: number;

  // GoodWith Tags
  goodWith?: string[];

  // Pagination (from BaseFilterDto)
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

// Pet API response wrapper for pagination
export interface PaginatedPetsResponse {
  items: Pet[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Create Pet DTO
export interface CreatePetDto {
  shelterId: number;
  speciesId?: number;
  breedId?: number;
  activityLevelId?: number;
  healthStatusId?: number;
  colorId?: number;
  coatLengthId?: number;
  species?: string;
  breed?: string;
  activityLevel?: string;
  healthStatus?: string;
  color?: string;
  coatLength?: string;
  name: string;
  age: string;
  gender: string;
  size: string;
  microchipped?: boolean;
  description: string;
}

// Update Pet DTO
export interface UpdatePetDto {
  shelterId?: number;
  speciesId?: number;
  breedId?: number;
  activityLevelId?: number;
  healthStatusId?: number;
  colorId?: number;
  coatLengthId?: number;
  species?: string;
  breed?: string;
  activityLevel?: string;
  healthStatus?: string;
  color?: string;
  coatLength?: string;
  name?: string;
  age?: string;
  gender?: string;
  size?: string;
  microchipped?: boolean;
  description?: string;
  isAdopted?: boolean;
}

// Pet Image DTO
export interface PetImageDto {
  id: number;
  petId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  contentType: string;
  isPrimary: boolean;
  uploadedAt: string;
}

// Removed PetImageDto as it's replaced by photoUrls: string[]
// Removed other DTOs as their properties are flattened into Pet interface


