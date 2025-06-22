// Shelter Models matching C# DTOs
import { AddressDto } from "./Address";

export interface Shelter {
  shelterId: number;
  name: string;
  address?: AddressDto;
  phoneNumber?: string;
  email?: string;
  website?: string;
  donationUrl?: string;
  description?: string;
}

// Shelter Filter DTO matching the C# ShelterFilterDto
export interface ShelterFilterDto {
  // Basic Filters
  name?: string;
  city?: string;
  state?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  donationUrl?: string;

  // Pagination (from BaseFilterDto)
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

// Shelter API response wrapper for pagination
export interface PaginatedSheltersResponse {
  items: Shelter[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Create Shelter DTO
export interface CreateShelterDto {
  name: string;
  description?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  address?: AddressDto;
}

// Update Shelter DTO
export interface UpdateShelterDto {
  name?: string;
  description?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  address?: AddressDto;
}

// Shelter Metrics DTO
export interface ShelterMetricsDto {
  shelterId: number;
  shelterName?: string;
  totalPets: number;
  availablePets: number;
  adoptedPets: number;
  followerCount: number;
  averageRating: number;
  reviewCount: number;
}

// Shelter Follower DTO
export interface ShelterFollowerDto {
  shelterFollowerId: number;
  userId: string;
  shelterId: number;
  createdAt: string;
}

// Shelter Application DTOs
export interface CreateShelterApplicationDto {
  userId?: string; // Will be set from auth context
  shelterName: string;
  address: AddressDto;
  remarks?: string;
}

export interface ShelterCreationRequestDto {
  requestId: number;
  userId: string;
  shelterName: string;
  requestedAddress?: string;
  addressId: number;
  requestDate: string;
  status: string;
  remarks?: string;
  isApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShelterApplicationFilterDto {
  isApproved?: boolean;
  status?: string;
  createdAfter?: string;
  createdBefore?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

// Paginated Shelter Applications Response
export interface PaginatedShelterApplicationsResponse {
  items: ShelterCreationRequestDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Update Shelter Application Status DTO
export interface UpdateShelterApplicationStatusDto {
  isApproved: boolean;
  remarks?: string;
}
