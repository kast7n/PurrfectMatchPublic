using PurrfectMatch.Domain.Specifications;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Colors;
using PurrfectMatch.Shared.Extensions;
using Color = PurrfectMatch.Domain.Entities.Color;

namespace PurrfectMatch.Application.Specifications.Pets.Attributes.Colors
{
    public class ColorsFilterSpecification : BaseSpecification<Color>
    {
        public ColorsFilterSpecification(ColorFilterDto filter)
            : base(c => true) // Start with a base criteria that's always true
        {
            // Apply filters only if the corresponding properties are not null
            if (!string.IsNullOrEmpty(filter.Color1))
                Criteria = Criteria.And(c => c.Color1.Contains(filter.Color1));

            // Apply pagination
            ApplyPaging(filter.PageNumber, filter.PageSize);

            // Apply sorting
            ApplySorting(filter.SortBy, filter.SortDescending);
        }

        private void ApplySorting(string? sortBy, bool sortDescending)
        {
            if (string.IsNullOrEmpty(sortBy)) return;

            switch (sortBy.ToLower())
            {
                case "color1":
                    if (sortDescending) ApplyOrderByDescending(c => c.Color1);
                    else ApplyOrderBy(c => c.Color1);
                    break;
                default:
                    break;
            }
        }
    }
}



