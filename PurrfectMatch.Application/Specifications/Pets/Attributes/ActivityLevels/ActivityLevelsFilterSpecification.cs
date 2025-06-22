using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Specifications;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.ActivityLevels;
using PurrfectMatch.Shared.Extensions;

namespace PurrfectMatch.Application.Specifications.Pets.Attributes.ActivityLevels
{
    public class ActivityLevelsFilterSpecification : BaseSpecification<ActivityLevel>
    {
        public ActivityLevelsFilterSpecification(ActivityLevelFilterDto filter)
            : base(a => true) // Start with a base criteria that's always true
        {
            // Apply filters only if the corresponding properties are not null
            if (!string.IsNullOrEmpty(filter.Activity))
                Criteria = Criteria.And(a => a.Activity.Contains(filter.Activity));

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
                case "activity":
                    if (sortDescending) ApplyOrderByDescending(a => a.Activity);
                    else ApplyOrderBy(a => a.Activity);
                    break;
                default:
                    break;
            }
        }
    }
}



