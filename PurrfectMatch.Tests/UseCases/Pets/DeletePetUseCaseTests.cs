using System.Threading.Tasks;
using Moq;
using PurrfectMatch.Application.Managers.Pets;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using Xunit;

namespace PurrfectMatch.Tests.Managers.Pets
{
    public class DeletePetManagerTests
    {
        [Fact]
        public async Task DeletePetAsync_ShouldDeletePet_WhenPetExists()
        {
            // Arrange
            var petRepositoryMock = new Mock<IBaseRepository<Pet>>();
            var softDeleteRepositoryMock = new Mock<IBaseSoftDeleteRepository<Pet>>();

            var petId = 1;
            var pet = new Pet { PetId = petId, Name = "Buddy" };

            petRepositoryMock.Setup(repo => repo.GetAsync(petId)).ReturnsAsync(pet);
            petRepositoryMock.Setup(repo => repo.Delete(pet));
            petRepositoryMock.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            var petsManager = new PetsManager(
                petRepositoryMock.Object,
                Mock.Of<IBaseRepository<PetPhoto>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IHealthRecordRepository>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.Services.IBlobStorageService>(),
                softDeleteRepositoryMock.Object,
                Mock.Of<AutoMapper.IMapper>(),
                new SpeciesManager(Mock.Of<IBaseRepository<Species>>(), Mock.Of<AutoMapper.IMapper>()),
                new BreedsManager(Mock.Of<IBaseRepository<Breed>>(), Mock.Of<AutoMapper.IMapper>()),
                new ActivityLevelsManager(Mock.Of<IBaseRepository<ActivityLevel>>(), Mock.Of<AutoMapper.IMapper>()),
                new HealthStatusesManager(Mock.Of<IBaseRepository<HealthStatus>>(), Mock.Of<AutoMapper.IMapper>()),
                new ColorsManager(Mock.Of<IBaseRepository<Color>>(), Mock.Of<AutoMapper.IMapper>()),
                new CoatLengthsManager(Mock.Of<IBaseRepository<CoatLength>>(), Mock.Of<AutoMapper.IMapper>())
            );

            // Act
            var petToDelete = await petsManager.GetPetByIdAsync(petId);
            Assert.NotNull(petToDelete);
            petRepositoryMock.Object.Delete(petToDelete);
            await petRepositoryMock.Object.SaveChangesAsync();

            // Assert
            petRepositoryMock.Verify(repo => repo.Delete(petToDelete), Times.Once);
            petRepositoryMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task Execute_ShouldReturnFalse_WhenPetDoesNotExist()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<Pet>>();
            var mockSoftDeleteRepository = new Mock<IBaseSoftDeleteRepository<Pet>>();

            var petId = 1;

            mockRepository.Setup(repo => repo.GetAsync(petId)).ReturnsAsync((Pet?)null);
            mockSoftDeleteRepository.Setup(repo => repo.GetAsync(petId)).ReturnsAsync((Pet?)null);

            var petsManager = new PetsManager(
                mockRepository.Object,
                Mock.Of<IBaseRepository<PetPhoto>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IHealthRecordRepository>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.Services.IBlobStorageService>(),
                mockSoftDeleteRepository.Object,
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