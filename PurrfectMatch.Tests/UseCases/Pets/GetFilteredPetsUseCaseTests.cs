using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Pets;
using Xunit;
using PurrfectMatch.Application.Specifications.PetSpecifications;
using PurrfectMatch.Application.Managers.Pets;
using PurrfectMatch.Application.Managers.Pets.Attributes;

namespace PurrfectMatch.Tests.UseCases.Pets
{
    public class GetFilteredPetsUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ShouldReturnFilteredPets()
        {
            // Arrange
            var mockPetRepository = new Mock<IBaseRepository<Pet>>();

            var filter = new PetFilterDto { Name = "Buddy" };
            var pets = new List<Pet>
            {
                new Pet { PetId = 1, Name = "Buddy", Age = "2" },
                new Pet { PetId = 2, Name = "Buddy", Age = "3" }
            };

            mockPetRepository.Setup(repo => repo.ListAsync(It.IsAny<PetsFilterSpecification>()))
                              .ReturnsAsync(pets);

            var petsManager = new PetsManager(
                mockPetRepository.Object,
                Mock.Of<IBaseRepository<PetPhoto>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IHealthRecordRepository>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.Services.IBlobStorageService>(),
                Mock.Of<IBaseSoftDeleteRepository<Pet>>(),
                Mock.Of<AutoMapper.IMapper>(),
                new SpeciesManager(Mock.Of<IBaseRepository<Species>>(), Mock.Of<AutoMapper.IMapper>()),
                new BreedsManager(Mock.Of<IBaseRepository<Breed>>(), Mock.Of<AutoMapper.IMapper>()),
                new ActivityLevelsManager(Mock.Of<IBaseRepository<ActivityLevel>>(), Mock.Of<AutoMapper.IMapper>()),
                new HealthStatusesManager(Mock.Of<IBaseRepository<HealthStatus>>(), Mock.Of<AutoMapper.IMapper>()),
                new ColorsManager(Mock.Of<IBaseRepository<Color>>(), Mock.Of<AutoMapper.IMapper>()),
                new CoatLengthsManager(Mock.Of<IBaseRepository<CoatLength>>(), Mock.Of<AutoMapper.IMapper>())
            );

            // Act
            var result = await petsManager.GetFilteredPetsAsync(filter);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Contains(result, p => p.Name == "Buddy" && p.Age == "2");
            Assert.Contains(result, p => p.Name == "Buddy" && p.Age == "3");
        }
    }
}