using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Application.Managers.Pets;
using PurrfectMatch.Application.Specifications.PetSpecifications;
using PurrfectMatch.Application.Specifications.ShelterSpecifications;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Entities;

namespace PurrfectMatch.Api.Controllers
{
    public class StatisticsController(
        PetsManager petsManager,
        IBaseRepository<Pet> petRepository,
        IBaseRepository<Shelter> shelterRepository) : BaseApiController
    {
        [HttpGet("global")]
        public async Task<IActionResult> GetGlobalStatistics()
        {
            try
            {
                // Get available pets count (not adopted and not deleted) using repository directly
                var availablePetsFilter = new PurrfectMatch.Shared.DTOs.Pets.PetFilterDto
                {
                    IsAdopted = false,
                    IsDeleted = false,
                    PageSize = int.MaxValue
                };
                var availablePetsSpec = new PetsFilterSpecification(availablePetsFilter);
                var availablePetsCount = await petRepository.CountAsync(availablePetsSpec);

                // Get total shelters count using repository directly
                var sheltersFilter = new PurrfectMatch.Shared.DTOs.Shelters.ShelterFilterDto
                {
                    PageSize = int.MaxValue
                };
                var sheltersSpec = new ShelterFilterSpecification(sheltersFilter);
                var totalSheltersCount = await shelterRepository.CountAsync(sheltersSpec);

                // Get adopted pets count (happy matches) using repository directly
                var adoptedPetsFilter = new PurrfectMatch.Shared.DTOs.Pets.PetFilterDto
                {
                    IsAdopted = true,
                    IsDeleted = false,
                    PageSize = int.MaxValue
                };
                var adoptedPetsSpec = new PetsFilterSpecification(adoptedPetsFilter);
                var adoptedPetsCount = await petRepository.CountAsync(adoptedPetsSpec);

                var statistics = new
                {
                    AvailablePets = availablePetsCount,
                    SheltersJoined = totalSheltersCount,
                    HappyMatches = adoptedPetsCount
                };

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving global statistics", error = ex.Message });
            }
        }
    }
}
