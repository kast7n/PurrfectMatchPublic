using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Specifications;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Species;
using PurrfectMatch.Shared.Extensions;

namespace PurrfectMatch.Application.Specifications.Pets.Attributes.SpeciesAttribute
{
    public class SpeciesFilterSpecification : BaseSpecification<Species>
    {
        public SpeciesFilterSpecification(SpeciesFilterDto filter)
            : base(s => true) // Start with a base criteria that's always true
        {
            // Apply filters only if the corresponding properties are not null
            if (!string.IsNullOrEmpty(filter.Name))
                Criteria = Criteria.And(s => s.Name.Contains(filter.Name));

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
                case "name":
                    if (sortDescending) ApplyOrderByDescending(s => s.Name);
                    else ApplyOrderBy(s => s.Name);
                    break;
                default:
                    break;
            }
        }
    }
}

