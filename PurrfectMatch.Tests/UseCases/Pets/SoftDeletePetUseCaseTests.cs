using System.Threading.Tasks;
using Moq;
using PurrfectMatch.Application.Managers.Pets;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Pets
{
    public class SoftDeletePetUseCaseTests
    {
        [Fact]
        public async Task Execute_ShouldSoftDeletePet_WhenPetExists()
        {
            // Arrange
            var mockRepository = new Mock<IBaseSoftDeleteRepository<Pet>>();
            var mockPetRepository = new Mock<IBaseRepository<Pet>>();

            var petId = 1;
            var pet = new Pet { PetId = petId, Name = "Buddy", IsDeleted = false };

            mockRepository.Setup(repo => repo.GetAsync(petId)).ReturnsAsync(pet);
            mockRepository.Setup(repo => repo.Delete(pet));
            mockRepository.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            var petsManager = new PetsManager(
                mockPetRepository.Object,
                Mock.Of<IBaseRepository<PetPhoto>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IHealthRecordRepository>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.Services.IBlobStorageService>(),
                mockRepository.Object,
                Mock.Of<AutoMapper.IMapper>(),
                new SpeciesManager(Mock.Of<IBaseRepository<Species>>(), Mock.Of<AutoMapper.IMapper>()),
                new BreedsManager(Mock.Of<IBaseRepository<Breed>>(), Mock.Of<AutoMapper.IMapper>()),
                new ActivityLevelsManager(Mock.Of<IBaseRepository<ActivityLevel>>(), Mock.Of<AutoMapper.IMapper>()),
                new HealthStatusesManager(Mock.Of<IBaseRepository<HealthStatus>>(), Mock.Of<AutoMapper.IMapper>()),
                new ColorsManager(Mock.Of<IBaseRepository<Color>>(), Mock.Of<AutoMapper.IMapper>()),
                new CoatLengthsManager(Mock.Of<IBaseRepository<CoatLength>>(), Mock.Of<AutoMapper.IMapper>())
            );

            // Act
            var result = await petsManager.SoftDeletePetAsync(petId);

            // Assert
            Assert.True(result);
            mockRepository.Verify(repo => repo.Delete(pet), Times.Once);
            mockRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task Execute_ShouldReturnFalse_WhenPetDoesNotExist()
        {
            // Arrange
            var mockRepository = new Mock<IBaseSoftDeleteRepository<Pet>>();
            var mockPetRepository = new Mock<IBaseRepository<Pet>>();

            var petId = 1;

            mockRepository.Setup(repo => repo.GetAsync(petId)).ReturnsAsync((Pet?)null);

            var petsManager = new PetsManager(
                mockPetRepository.Object,
                Mock.Of<IBaseRepository<PetPhoto>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IHealthRecordRepository>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.Services.IBlobStorageService>(),
                mockRepository.Object,
                Mock.Of<AutoMapper.IMapper>(),
                new SpeciesManager(Mock.Of<IBaseRepository<Species>>(), Mock.Of<AutoMapper.IMapper>()),
                new BreedsManager(Mock.Of<IBaseRepository<Breed>>(), Mock.Of<AutoMapper.IMapper>()),
                new ActivityLevelsManager(Mock.Of<IBaseRepository<ActivityLevel>>(), Mock.Of<AutoMapper.IMapper>()),
                new HealthStatusesManager(Mock.Of<IBaseRepository<HealthStatus>>(), Mock.Of<AutoMapper.IMapper>()),
                new ColorsManager(Mock.Of<IBaseRepository<Color>>(), Mock.Of<AutoMapper.IMapper>()),
                new CoatLengthsManager(Mock.Of<IBaseRepository<CoatLength>>(), Mock.Of<AutoMapper.IMapper>())
            );

            // Act
            var result = await petsManager.SoftDeletePetAsync(petId);

            // Assert
            Assert.False(result);
        }
    }
}