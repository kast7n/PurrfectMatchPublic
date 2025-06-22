using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Specifications;
using PurrfectMatch.Shared.DTOs.Favorites;
using PurrfectMatch.Shared.Extensions;

namespace PurrfectMatch.Application.Specifications.Favorites
{
    public class FavoritesFilterSpecification : BaseSpecification<Favorite>
    {
        public FavoritesFilterSpecification(FavoriteFilterDto filter)
            : base(favorite => true) // Start with a base criteria that's always true
        {
            if (filter.UserId != null || filter.UserId == "")
                Criteria = Criteria.And(favorite => favorite.UserId == filter.UserId);

            if (filter.PetId.HasValue)
                Criteria = Criteria.And(favorite => favorite.PetId == filter.PetId.Value);

            ApplyPaging(filter.PageNumber, filter.PageSize);
            ApplySorting(filter.SortBy, filter.SortDescending);
        }

        private void ApplySorting(string? sortBy, bool sortDescending)
        {
            if (string.IsNullOrEmpty(sortBy)) return;

            switch (sortBy.ToLower())
            {
                case "userid":
                    if (sortDescending) ApplyOrderByDescending(f => f.UserId);
                    else ApplyOrderBy(f => f.UserId);
                    break;
                case "petid":
                    if (sortDescending) ApplyOrderByDescending(f => f.PetId);
                    else ApplyOrderBy(f => f.PetId);
                    break;
                default:
                    break;
            }
        }
    }
}