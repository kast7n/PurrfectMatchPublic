using PurrfectMatch.Shared.DTOs.Pets;
using PurrfectMatch.Domain.Specifications;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.Extensions;

namespace PurrfectMatch.Application.Specifications.PetSpecifications
{
    public class PetsFilterSpecification : BaseSpecification<Pet>
    {
        public PetsFilterSpecification(PetFilterDto filter)
            : base(pet => true) // Start with a base criteria that's always true
        {
            // Apply filters only if the corresponding properties are not null

            // Conditionally apply IsDeleted and IsAdopted filters
            if (filter.IsDeleted.HasValue)
            {
                Criteria = Criteria.And(pet => pet.IsDeleted == filter.IsDeleted.Value);
            }
            else
            {
                // Default to excluding deleted pets if not specified
                Criteria = Criteria.And(pet => !pet.IsDeleted);
            }            if (filter.IsAdopted.HasValue)
            {
                Criteria = Criteria.And(pet => pet.IsAdopted == filter.IsAdopted.Value);
            }
            else
            {
                // Default to excluding adopted pets if not specified
                Criteria = Criteria.And(pet => !pet.IsAdopted);
            }

            if (filter.Name != null)
                Criteria = Criteria.And(pet => pet.Name.Contains(filter.Name));

            if (filter.SpeciesId.HasValue)
                Criteria = Criteria.And(pet => pet.SpeciesId == filter.SpeciesId);

            if (filter.BreedId.HasValue)
                Criteria = Criteria.And(pet => pet.BreedId == filter.BreedId);

            if (filter.Age != null)
                Criteria = Criteria.And(pet => pet.Age == filter.Age);

            if (filter.Gender != null)
                Criteria = Criteria.And(pet => pet.Gender == filter.Gender);

            if (filter.Size != null)
                Criteria = Criteria.And(pet => pet.Size == filter.Size);

            if (filter.CoatLengthId.HasValue)
                Criteria = Criteria.And(pet => pet.CoatLengthId == filter.CoatLengthId);

            if (filter.ColorId.HasValue)
                Criteria = Criteria.And(pet => pet.ColorId == filter.ColorId);

            if (filter.ActivityLevelId.HasValue)
                Criteria = Criteria.And(pet => pet.ActivityLevelId == filter.ActivityLevelId);

            if (filter.HealthStatusId.HasValue)
                Criteria = Criteria.And(pet => pet.HealthStatusId == filter.HealthStatusId);

            if (filter.Microchipped.HasValue)
                Criteria = Criteria.And(pet => pet.Microchipped == filter.Microchipped);

            if (filter.ShelterId.HasValue)
                Criteria = Criteria.And(pet => pet.ShelterId == filter.ShelterId);

            if (filter.GoodWith != null && filter.GoodWith.Count != 0)
            {
                Criteria = Criteria.And(pet => pet.PetGoodWiths.Any(pgw => filter.GoodWith.Contains(pgw.GoodWith.GoodWith1)));
            }

            AddInclude(p => p.Species);
            AddInclude(p => p.Breed!);
            AddInclude(p => p.CoatLength!);
            AddInclude(p => p.Color!);
            AddInclude(p => p.ActivityLevel!);
            AddInclude(p => p.HealthStatus!);
            AddInclude(p => p.Shelter);
            AddInclude(p => p.PetPhotos);

            ApplyPaging(filter.PageNumber, filter.PageSize);
            ApplySorting(filter.SortBy!, filter.SortDescending);
        }

        private void ApplySorting(string sortBy, bool sortDescending)
        {
            if (string.IsNullOrEmpty(sortBy)) return;

            switch (sortBy.ToLower())
            {
                case "name":
                    if (sortDescending) ApplyOrderByDescending(p => p.Name);
                    else ApplyOrderBy(p => p.Name);
                    break;
                case "age":
                    if (sortDescending) ApplyOrderByDescending(p => p.Age ?? string.Empty);
                    else ApplyOrderBy(p => p.Age ?? string.Empty);
                    break;
                case "species":
                    if (sortDescending) ApplyOrderByDescending(p => p.Species != null ? p.Species.Name : string.Empty);
                    else ApplyOrderBy(p => p.Species != null ? p.Species.Name : string.Empty);
                    break;
                case "breed":
                    if (sortDescending) ApplyOrderByDescending(p => p.Breed != null ? p.Breed.Name : string.Empty);
                    else ApplyOrderBy(p => p.Breed != null ? p.Breed.Name : string.Empty);
                    break;
                case "gender":
                    if (sortDescending) ApplyOrderByDescending(p => p.Gender != null ? p.Gender : string.Empty);
                    else ApplyOrderBy(p => p.Gender != null ? p.Gender : string.Empty);
                    break;
                case "size":
                    if (sortDescending) ApplyOrderByDescending(p => p.Size != null ? p.Size : string.Empty);
                    else ApplyOrderBy(p => p.Size != null ? p.Size : string.Empty);
                    break;
                case "coatlength":
                    if (sortDescending) ApplyOrderByDescending(p => p.CoatLength != null ? p.CoatLength.Length : string.Empty);
                    else ApplyOrderBy(p => p.CoatLength != null ? p.CoatLength.Length : string.Empty);
                    break;
                case "color":
                    if (sortDescending) ApplyOrderByDescending(p => p.Color != null ? p.Color.Color1 : string.Empty);
                    else ApplyOrderBy(p => p.Color != null ? p.Color.Color1 : string.Empty);
                    break;
                case "activitylevel":
                    if (sortDescending) ApplyOrderByDescending(p => p.ActivityLevel != null ? p.ActivityLevel.Activity : string.Empty);
                    else ApplyOrderBy(p => p.ActivityLevel != null ? p.ActivityLevel.Activity : string.Empty);
                    break;
                case "healthstatus":
                    if (sortDescending) ApplyOrderByDescending(p => p.HealthStatus != null ? p.HealthStatus.Status : string.Empty);
                    else ApplyOrderBy(p => p.HealthStatus != null ? p.HealthStatus.Status : string.Empty);
                    break;
                case "shelter":
                    if (sortDescending) ApplyOrderByDescending(p => p.Shelter != null ? p.Shelter.Name : string.Empty);
                    else ApplyOrderBy(p => p.Shelter != null ? p.Shelter.Name : string.Empty);
                    break;
                default:
                    break;
            }
        }
    }
}

