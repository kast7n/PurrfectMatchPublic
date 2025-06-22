// Post Models matching C# DTOs

export interface Post {
  postId: number;
  postType: string;
  shelterId?: number;
  shelterName?: string;
  userId: string;
  userName?: string;
  title: string;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  tags: Tag[];
}

export interface Tag {
  tagId: number;
  tagName: string;
  createdAt: string; // ISO date string
}

// Post Filter DTO matching the C# PostFilterDto
export interface PostFilterDto {
  postType?: string;
  shelterId?: number;
  userId?: string;
  title?: string;
  content?: string;
  tagId?: number;
  createdAfter?: string; // ISO date string
  createdBefore?: string; // ISO date string
  
  // Pagination (from BaseFilterDto)
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

// Post API response wrapper for pagination
export interface PaginatedPostsResponse {
  items: Post[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Create Post DTO
export interface CreatePostDto {
  postType: string;
  shelterId?: number;
  userId?: string; // Will be set by the backend from authenticated user
  title: string;
  content: string;
  tagIds?: number[];
}

// Update Post DTO
export interface UpdatePostDto {
  postType?: string;
  title?: string;
  content?: string;
  tagIds?: number[];
}

// Tag Filter DTO matching the C# TagFilterDto
export interface TagFilterDto {
  tagName?: string;
  createdAfter?: string; // ISO date string
  createdBefore?: string; // ISO date string
  
  // Pagination (from BaseFilterDto)
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

// Create Tag DTO
export interface CreateTagDto {
  tagName: string;
}

// Update Tag DTO
export interface UpdateTagDto {
  tagName?: string;
}
