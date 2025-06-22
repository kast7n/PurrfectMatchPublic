export interface FavoriteDto {
  // Assuming FavoriteDto in C# (from PurrfectMatch.Shared/DTOs/Users/FavoriteDto.cs)
  // might look like this:
  // public int Id { get; set; } // Or a composite key if not using a separate Id
  // public string UserId { get; set; }
  // public int PetId { get; set; }
  // public DateTime DateFavorited { get; set; }
  // public PetDto Pet { get; set; } // Often, a favorite includes details of the pet

  id?: number; // Optional: if your DTO includes a specific favorite ID
  userId: string;
  petId: number;
  dateFavorited: string; // ISO date string

  // It's common to include some basic Pet info if this DTO is used to display a list of favorites
  // For example:
  // petName?: string;
  // petPrimaryImageUrl?: string;
}

// Based on AddToFavoritesDto.cs (from PurrfectMatch.Shared/DTOs/Users/AddToFavoritesDto.cs)
// export interface AddToFavoritesDto {
//  petId: number;
// }
