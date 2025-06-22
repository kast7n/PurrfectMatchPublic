using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Specifications;
using PurrfectMatch.Shared.DTOs.Addresses;
using PurrfectMatch.Shared.DTOs.Shelters;
using PurrfectMatch.Shared.Extensions;

namespace PurrfectMatch.Application.Specifications.ShelterSpecifications
{
    public class ShelterFilterSpecification : BaseSpecification<Shelter>
    {
        public ShelterFilterSpecification(ShelterFilterDto filter)
            : base(shelter => true)
        {
            if (!string.IsNullOrEmpty(filter.Name))
            {
                Criteria = Criteria.And(shelter => (shelter.Name ?? string.Empty).Contains(filter.Name));
            }

            if (!string.IsNullOrEmpty(filter.City))
            {
                Criteria = Criteria.And(shelter => (shelter.Address!.City ?? string.Empty).Contains(filter.City));
            }

            if (!string.IsNullOrEmpty(filter.State))
            {
                Criteria = Criteria.And(shelter => (shelter.Address!.State ?? string.Empty).Contains(filter.State));
            }

            AddInclude(shelter => shelter.Address!);

            ApplyPaging(filter.PageNumber, filter.PageSize);
            ApplySorting(filter.SortBy!, filter.SortDescending);
        }

        private void ApplySorting(string sortBy, bool sortDescending)
        {
            if (string.IsNullOrEmpty(sortBy)) return;

            switch (sortBy.ToLower())
            {
                case "name":
                    if (sortDescending) ApplyOrderByDescending(s => s.Name ?? string.Empty);
                    else ApplyOrderBy(s => s.Name ?? string.Empty);
                    break;
                case "city":
                    if (sortDescending) ApplyOrderByDescending(s => s.Address != null && s.Address.City != null ? s.Address.City : string.Empty);
                    else ApplyOrderBy(s => s.Address != null && s.Address.City != null ? s.Address.City : string.Empty);
                    break;
                case "state":
                    if (sortDescending) ApplyOrderByDescending(s => s.Address != null && s.Address.State != null ? s.Address.State : string.Empty);
                    else ApplyOrderBy(s => s.Address != null && s.Address.State != null ? s.Address.State : string.Empty);
                    break;
                default:
                    break;
            }
        }
    }
}