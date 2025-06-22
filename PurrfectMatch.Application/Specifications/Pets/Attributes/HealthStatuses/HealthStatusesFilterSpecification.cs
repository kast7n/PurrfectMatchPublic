using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Specifications;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.HealthStatuses;
using PurrfectMatch.Shared.Extensions;

namespace PurrfectMatch.Application.Specifications.Pets.Attributes.HealthStatuses
{
    public class HealthStatusesFilterSpecification : BaseSpecification<HealthStatus>
    {
        public HealthStatusesFilterSpecification(HealthStatusFilterDto filter)
            : base(h => true) // Start with a base criteria that's always true
        {
            // Apply filters only if the corresponding properties are not null
            if (!string.IsNullOrEmpty(filter.Status))
                Criteria = Criteria.And(h => h.Status.Contains(filter.Status));

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
                case "status":
                    if (sortDescending) ApplyOrderByDescending(h => h.Status);
                    else ApplyOrderBy(h => h.Status);
                    break;
                default:
                    break;
            }
        }
    }
}



