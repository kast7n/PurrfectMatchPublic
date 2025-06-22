using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Specifications;

using PurrfectMatch.Shared.DTOs.Pets.Attributes.Breeds;
using PurrfectMatch.Shared.Extensions;

namespace PurrfectMatch.Application.Specifications.Pets.Attributes.Breeds
{
    public class BreedsFilterSpecification : BaseSpecification<Breed>
    {
        public BreedsFilterSpecification(BreedFilterDto filter)
            : base(b => true) // Start with a base criteria that's always true
        {
            // Console.WriteLine("==================== Start of Filter Specification ====================");
            if (!string.IsNullOrEmpty(filter.Name))
            {
                var nameFilter = filter.Name.Trim().ToLower();
                Criteria = Criteria.And(b => b.Name.ToLower().Contains(nameFilter));
                // Console.WriteLine($"Filter applied: Name contains '{nameFilter}'");
            }

            if (filter.SpeciesId.HasValue)
            {
                Criteria = Criteria.And(b => b.SpeciesId == filter.SpeciesId.Value);
                // Console.WriteLine($"Filter applied: SpeciesId equals '{filter.SpeciesId.Value}'");
            }            // Console.WriteLine($"Final Criteria: {Criteria}");

            // Include Species navigation property unconditionally
            AddInclude(b => b.Species);

            // Apply pagination
            ApplyPaging(filter.PageNumber, filter.PageSize);

            // Apply sorting
            ApplySorting(filter.SortBy, filter.SortDescending);
            // Console.WriteLine("==================== End of Filter Specification ====================");
        }

        private void ApplySorting(string? sortBy, bool sortDescending)
        {
            if (string.IsNullOrEmpty(sortBy)) return;

            switch (sortBy.ToLower())
            {
                case "name":
                    if (sortDescending) ApplyOrderByDescending(b => b.Name);
                    else ApplyOrderBy(b => b.Name);
                    break;
                case "species":
                    if (sortDescending) ApplyOrderByDescending(b => b.Species != null ? b.Species.Name : string.Empty);
                    else ApplyOrderBy(b => b.Species != null ? b.Species.Name : string.Empty);
                    break;
                default:
                    break;
            }
        }
    }
}
