using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Application.Managers.Pets;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Pets;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Pets
{
    public class UpdatePetUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ShouldUpdatePet_WhenPetExists()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<Pet>>();
            var mockMapper = new Mock<IMapper>();

            var petId = 1;
            var pet = new Pet { PetId = petId, Name = "Buddy", Age = "2" };
            var updatePetDto = new UpdatePetDto { Name = "Max", Age = "3", Description = "Updated pet details" };

            mockRepository.Setup(repo => repo.GetAsync(petId)).ReturnsAsync(pet);
            mockMapper.Setup(mapper => mapper.Map(updatePetDto, It.IsAny<Pet>())).Callback<UpdatePetDto, Pet>((dto, p) =>
            {
                p.Name = dto.Name;
                p.Age = dto.Age;
                p.Description = dto.Description;
            });
            mockRepository.Setup(repo => repo.Update(pet));
            mockRepository.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            var petsManager = new PetsManager(
                mockRepository.Object,
                Mock.Of<IBaseRepository<PetPhoto>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IHealthRecordRepository>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.Services.IBlobStorageService>(),
                Mock.Of<IBaseSoftDeleteRepository<Pet>>(),
                mockMapper.Object,
                new SpeciesManager(Mock.Of<IBaseRepository<Species>>(), Mock.Of<AutoMapper.IMapper>()),
                new BreedsManager(Mock.Of<IBaseRepository<Breed>>(), Mock.Of<AutoMapper.IMapper>()),
                new ActivityLevelsManager(Mock.Of<IBaseRepository<ActivityLevel>>(), Mock.Of<AutoMapper.IMapper>()),
                new HealthStatusesManager(Mock.Of<IBaseRepository<HealthStatus>>(), Mock.Of<AutoMapper.IMapper>()),
                new ColorsManager(Mock.Of<IBaseRepository<Color>>(), Mock.Of<AutoMapper.IMapper>()),
                new CoatLengthsManager(Mock.Of<IBaseRepository<CoatLength>>(), Mock.Of<AutoMapper.IMapper>())
            );

            // Act
            var result = await petsManager.UpdatePetAsync(petId, updatePetDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Max", result.Name);
            Assert.Equal("3", result.Age);
            mockRepository.Verify(repo => repo.Update(pet), Times.Once);
            mockRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldReturnNull_WhenPetDoesNotExist()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<Pet>>();
            var mockMapper = new Mock<IMapper>();

            var petId = 1;
            var updatePetDto = new UpdatePetDto { Name = "Max", Age = "3", Description = "Updated pet details" };

            mockRepository.Setup(repo => repo.GetAsync(petId)).ReturnsAsync((Pet?)null);

            var petsManager2 = new PetsManager(
                mockRepository.Object,
                Mock.Of<IBaseRepository<PetPhoto>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IHealthRecordRepository>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.Services.IBlobStorageService>(),
                Mock.Of<IBaseSoftDeleteRepository<Pet>>(),
                mockMapper.Object,
                new SpeciesManager(Mock.Of<IBaseRepository<Species>>(), Mock.Of<AutoMapper.IMapper>()),
                new BreedsManager(Mock.Of<IBaseRepository<Breed>>(), Mock.Of<AutoMapper.IMapper>()),
                new ActivityLevelsManager(Mock.Of<IBaseRepository<ActivityLevel>>(), Mock.Of<AutoMapper.IMapper>()),
                new HealthStatusesManager(Mock.Of<IBaseRepository<HealthStatus>>(), Mock.Of<AutoMapper.IMapper>()),
                new ColorsManager(Mock.Of<IBaseRepository<Color>>(), Mock.Of<AutoMapper.IMapper>()),
                new CoatLengthsManager(Mock.Of<IBaseRepository<CoatLength>>(), Mock.Of<AutoMapper.IMapper>())
            );

            // Act
            var result2 = await petsManager2.UpdatePetAsync(petId, updatePetDto);

            // Assert
            Assert.Null(result2);
        }
    }
}