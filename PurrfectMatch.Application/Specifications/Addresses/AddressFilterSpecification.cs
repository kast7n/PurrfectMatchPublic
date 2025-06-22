using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Specifications;
using PurrfectMatch.Shared.DTOs.Addresses;
using PurrfectMatch.Shared.Extensions;

namespace PurrfectMatch.Application.Specifications.Addresses
{
    public class AddressFilterSpecification : BaseSpecification<Address>
    {
        public AddressFilterSpecification(AddressFilterDto filter)
            : base(address => true)
        {
            if (!string.IsNullOrEmpty(filter.City))
            {
                Criteria = Criteria.And(address => (address.City ?? string.Empty).Contains(filter.City));
            }

            if (!string.IsNullOrEmpty(filter.State))
            {
                Criteria = Criteria.And(address => (address.State ?? string.Empty).Contains(filter.State));
            }

            ApplyPaging(filter.PageNumber, filter.PageSize);
            ApplySorting(filter.SortBy!, filter.SortDescending);
        }

        private void ApplySorting(string sortBy, bool sortDescending)
        {
            if (string.IsNullOrEmpty(sortBy)) return;

            switch (sortBy.ToLower())
            {
                case "city":
                    if (sortDescending) ApplyOrderByDescending(a => a.City ?? string.Empty);
                    else ApplyOrderBy(a => a.City ?? string.Empty);
                    break;
                case "state":
                    if (sortDescending) ApplyOrderByDescending(a => a.State ?? string.Empty);
                    else ApplyOrderBy(a => a.State ?? string.Empty);
                    break;
                default:
                    break;
            }
        }
    }
}