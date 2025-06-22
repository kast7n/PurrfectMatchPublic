export interface SpeciesDto {
  // Matches SpeciesDto in C#:
  // public int SpeciesId { get; set; }
  // public string Name { get; set; }
  speciesId: number;
  name: string;
}

export interface BreedDto {
  // Matches BreedDto in C#:
  // public int BreedId { get; set; }
  // public int SpeciesId { get; set; }
  // public string Name { get; set; }
  breedId: number;
  speciesId: number;
  name: string;
}

export interface CoatLengthDto {
  coatLengthId: number; 
  length: string; 
}

export interface ColorDto {
  colorId: number; 
  color1: string; 
  // hexCode?: string;
}

export interface ActivityLevelDto {
  activityLevelId: number; 
  activity: string; 
  // description?: string;
}

export interface HealthStatusDto {
  healthStatusId: number; 
  status: string; 
  // description?: string;
}

// This was ShelterFilterDto, which is for query parameters.
// If you need a DTO for Shelter details (e.g. from ShelterDto.cs), it would be different.
export interface ShelterFilterDto { // This is likely for filtering pets by shelter
  shelterId: number;
  name: string;
}

// You would also need a proper ShelterDto if you fetch shelter details
// Based on PurrfectMatch.Shared/DTOs/Shelters/ShelterDto.cs
export interface ShelterDisplayDto { // Renamed to avoid conflict if ShelterFilterDto is used elsewhere for filtering
  id: number;
  name: string;
  address?: string; // Or a full AddressDto
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  // other fields like operatingHours, adoptionPolicyUrl, etc.
}
