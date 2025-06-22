using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Specifications;
using PurrfectMatch.Shared.DTOs.AdoptionApplications;
using PurrfectMatch.Shared.Extensions;

namespace PurrfectMatch.Application.Specifications.AdoptionApplications
{
    public class AdoptionApplicationsFilterSpecification : BaseSpecification<AdoptionApplication>
    {        public AdoptionApplicationsFilterSpecification(AdoptionApplicationFilterDto filter)
            : base(application => true)
        {
            // Include Pet to enable filtering by shelter
            AddInclude(application => application.Pet);
            
            if (filter.IsDeleted.HasValue)
                Criteria = Criteria.And(application => application.IsDeleted == filter.IsDeleted.Value);
            else
                Criteria = Criteria.And(application => !application.IsDeleted);

            if (!string.IsNullOrEmpty(filter.UserId))
                Criteria = Criteria.And(application => application.UserId == filter.UserId);

            if (filter.PetId.HasValue)
                Criteria = Criteria.And(application => application.PetId == filter.PetId.Value);

            if (!string.IsNullOrEmpty(filter.Status))
                Criteria = Criteria.And(application => application.Status == filter.Status);

            if (filter.ApplicationDateAfter.HasValue)
                Criteria = Criteria.And(application => application.ApplicationDate >= filter.ApplicationDateAfter.Value);

            if (filter.ApplicationDateBefore.HasValue)
                Criteria = Criteria.And(application => application.ApplicationDate <= filter.ApplicationDateBefore.Value);

            if (filter.CreatedAfter.HasValue)
                Criteria = Criteria.And(application => application.CreatedAt >= filter.CreatedAfter.Value);            if (filter.CreatedBefore.HasValue)
                Criteria = Criteria.And(application => application.CreatedAt <= filter.CreatedBefore.Value);

            if (filter.ShelterId.HasValue)
                Criteria = Criteria.And(application => application.Pet.ShelterId == filter.ShelterId.Value);

            ApplyPaging(filter.PageNumber, filter.PageSize);
            ApplySorting(filter.SortBy, filter.SortDescending);
        }

        private void ApplySorting(string? sortBy, bool sortDescending)
        {
            if (string.IsNullOrEmpty(sortBy)) return;
            switch (sortBy.ToLower())
            {
                case "createdat":
                    if (sortDescending) ApplyOrderByDescending(a => a.CreatedAt);
                    else ApplyOrderBy(a => a.CreatedAt);
                    break;
                case "applicationdate":
                    if (sortDescending) ApplyOrderByDescending(a => a.ApplicationDate);
                    else ApplyOrderBy(a => a.ApplicationDate);
                    break;
                case "status":
                    if (sortDescending) ApplyOrderByDescending(a => a.Status);
                    else ApplyOrderBy(a => a.Status);
                    break;
                default:
                    if (sortDescending) ApplyOrderByDescending(a => a.ApplicationId);
                    else ApplyOrderBy(a => a.ApplicationId);
                    break;
            }
        }
    }
}