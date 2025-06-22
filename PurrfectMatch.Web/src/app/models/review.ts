// Review Models matching C# DTOs

export interface ReviewDto {
  reviewId: number;
  userId: string;
  userName: string;
  shelterId: number;
  shelterName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewDto {
  shelterId: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewDto {
  rating: number;
  comment: string;
}

export interface ShelterRatingStats {
  averageRating: number;
  count: number;
}

export interface ReviewFilterDto {
  shelterId?: number;
  userId?: string;
  minRating?: number;
  maxRating?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}
