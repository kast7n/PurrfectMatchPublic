using System.Threading.Tasks;
using Moq;
using PurrfectMatch.Application.Managers.Pets;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Pets
{
    public class GetPetByIdUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ShouldReturnPet_WhenPetExists()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<Pet>>();

            var petId = 1;
            var pet = new Pet { PetId = petId, Name = "Buddy" };

            mockRepository.Setup(repo => repo.GetAsync(petId)).ReturnsAsync(pet);

            var petsManager = new PetsManager(
                mockRepository.Object,
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
            var result = await petsManager.GetPetByIdAsync(petId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(petId, result.PetId);
            Assert.Equal("Buddy", result.Name);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldReturnNull_WhenPetDoesNotExist()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<Pet>>();

            var petId = 1;

            mockRepository.Setup(repo => repo.GetAsync(petId)).ReturnsAsync((Pet?)null);

            var petsManager = new PetsManager(
                mockRepository.Object,
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
            var result = await petsManager.GetPetByIdAsync(petId);

            // Assert
            Assert.Null(result);
        }
    }
}