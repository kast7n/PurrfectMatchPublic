using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Specifications;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.CoatLength;
using PurrfectMatch.Shared.Extensions;

namespace PurrfectMatch.Application.Specifications.Pets.Attributes.CoatLengths
{
    public class CoatLengthsFilterSpecification : BaseSpecification<CoatLength>
    {
        public CoatLengthsFilterSpecification(CoatLengthFilterDto filter)
            : base(c => true) // Start with a base criteria that's always true
        {
            // Apply filters only if the corresponding properties are not null
            if (!string.IsNullOrEmpty(filter.Length))
                Criteria = Criteria.And(c => c.Length.Contains(filter.Length));

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
                case "length":
                    if (sortDescending) ApplyOrderByDescending(c => c.Length);
                    else ApplyOrderBy(c => c.Length);
                    break;
                default:
                    break;
            }
        }
    }
}



