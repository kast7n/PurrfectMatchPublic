export type User = {
    id: string;
    email: string;
    roles: string[];
    shelterId?: number;
    shelterName?: string;
}

export interface UserManagement {
  id: string;
  userName?: string;
  email?: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd?: string;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  roles: string[];
  createdAt: string;
  shelterName?: string;
  shelterId?: number;
}

export interface UserFilter {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDescending: boolean;
  email?: string;
  userName?: string;
  role?: string;
  shelterId?: number;
  emailConfirmed?: boolean;
  isLockedOut?: boolean;
}

export interface UserResponse {
  items: UserManagement[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface AssignShelterManagerRequest {
  email: string;
  shelterId: number;
}

export interface RemoveShelterManagerRequest {
  userId: string;
  shelterId: number;
}

export interface RemoveUserRequest {
  userId: string;
}

export interface UpdateUserRoleRequest {
  userId: string;
  role: string;
}

export interface UpdateUserShelterRequest {
  userId: string;
  newShelterId?: number;
  oldShelterId?: number;
}

export interface UpdateUserDetailsRequest {
  userId: string;
  userName?: string;
  email?: string;
  phoneNumber?: string;
  emailConfirmed?: boolean;
  lockoutEnabled?: boolean;
  lockoutEnd?: string;
}