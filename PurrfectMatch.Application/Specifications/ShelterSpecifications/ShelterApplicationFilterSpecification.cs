using System.Linq.Expressions;
using PurrfectMatch.Shared.Extensions;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Specifications;
using PurrfectMatch.Shared.DTOs.Shelters;

namespace PurrfectMatch.Application.Specifications.ShelterSpecifications
{
    public class ShelterApplicationFilterSpecification : BaseSpecification<ShelterCreationRequest>
    {
        public ShelterApplicationFilterSpecification(ShelterApplicationFilterDto filter)
            : base(application => true)
        {
            if (filter.IsApproved.HasValue)
            {
                Criteria = Criteria.And(application => application.IsApproved == filter.IsApproved.Value);
            }

            if (filter.CreatedAfter.HasValue)
            {
                Criteria = Criteria.And(application => application.CreatedAt >= filter.CreatedAfter.Value);
            }

            if (filter.CreatedBefore.HasValue)
            {
                Criteria = Criteria.And(application => application.CreatedAt <= filter.CreatedBefore.Value);
            }

            ApplyPaging(filter.PageNumber, filter.PageSize);
            ApplySorting(filter.SortBy, filter.SortDescending);
        }

        private void ApplySorting(string? sortBy, bool sortDescending)
        {
            if (string.IsNullOrEmpty(sortBy)) return;

            switch (sortBy.ToLower())
            {
                case "createdat":
                    if (sortDescending) ApplyOrderByDescending(application => application.CreatedAt);
                    else ApplyOrderBy(application => application.CreatedAt);
                    break;
                case "isapproved":
                    if (sortDescending) ApplyOrderByDescending(application => application.IsApproved ?? false);
                    else ApplyOrderBy(application => application.IsApproved ?? false);
                    break;
                default:
                    break;
            }
        }
    }
}