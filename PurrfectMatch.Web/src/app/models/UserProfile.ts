export interface UserAddressDto {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  googleMapLink?: string;
}

export interface UserProfileDto {
  userId?: string;
  phoneNumber?: string;
  photoUrl?: string;
  age?: number;
  job?: string;
  currentPetsOwned: number;
  address?: UserAddressDto;
  generalInfo: string;
  housingType: string;
  hasYard: boolean;
  allergies?: string;
  experienceWithPets: string;
  createdAt: Date;
  updatedAt: Date;
}
