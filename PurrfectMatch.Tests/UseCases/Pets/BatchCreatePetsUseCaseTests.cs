using System.Collections.Generic;
using System.Linq;
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
    public class BatchCreatePetsUseCaseTests
    {        [Fact]
        public async Task BatchCreatePetsAsync_ShouldCreatePetsAndReturnIds()
        {
            // Arrange
            var mockPetRepository = new Mock<IBaseRepository<Pet>>();
            var mockPetPhotoRepository = new Mock<IBaseRepository<PetPhoto>>();
            var mockHealthRecordRepository = new Mock<PurrfectMatch.Domain.Interfaces.IRepositories.IHealthRecordRepository>();
            var mockBlobStorageService = new Mock<PurrfectMatch.Domain.Interfaces.Services.IBlobStorageService>();
            var mockSoftDeleteRepository = new Mock<IBaseSoftDeleteRepository<Pet>>();
            var mockMapper = new Mock<IMapper>();

            // Mock the attribute managers
            var mockSpeciesManager = new Mock<SpeciesManager>(Mock.Of<IBaseRepository<Species>>(), Mock.Of<IMapper>());
            var mockBreedsManager = new Mock<BreedsManager>(Mock.Of<IBaseRepository<Breed>>(), Mock.Of<IMapper>());
            var mockActivityLevelsManager = new Mock<ActivityLevelsManager>(Mock.Of<IBaseRepository<ActivityLevel>>(), Mock.Of<IMapper>());
            var mockHealthStatusesManager = new Mock<HealthStatusesManager>(Mock.Of<IBaseRepository<HealthStatus>>(), Mock.Of<IMapper>());
            var mockColorsManager = new Mock<ColorsManager>(Mock.Of<IBaseRepository<Color>>(), Mock.Of<IMapper>());
            var mockCoatLengthsManager = new Mock<CoatLengthsManager>(Mock.Of<IBaseRepository<CoatLength>>(), Mock.Of<IMapper>());

            var petDtos = new List<CreatePetDto>
            {
                new CreatePetDto { Name = "Buddy", Age = "2", Gender = "Male", Size = "Medium", Description = "Friendly dog" },
                new CreatePetDto { Name = "Max", Age = "3", Gender = "Male", Size = "Large", Description = "Playful dog" }
            };

            var pets = new List<Pet>
            {
                new Pet { PetId = 1, Name = "Buddy", Age = "2" },
                new Pet { PetId = 2, Name = "Max", Age = "3" }
            };

            mockMapper.SetupSequence(m => m.Map<Pet>(It.IsAny<CreatePetDto>()))
                      .Returns(pets[0])
                      .Returns(pets[1]);

            mockPetRepository.Setup(repo => repo.CreateAsync(It.IsAny<Pet>())).Returns(Task.CompletedTask);
            mockPetRepository.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            var petsManager = new PetsManager(
                mockPetRepository.Object,
                mockPetPhotoRepository.Object,
                mockHealthRecordRepository.Object,
                mockBlobStorageService.Object,
                mockSoftDeleteRepository.Object,
                mockMapper.Object,
                mockSpeciesManager.Object,
                mockBreedsManager.Object,
                mockActivityLevelsManager.Object,
                mockHealthStatusesManager.Object,
                mockColorsManager.Object,
                mockCoatLengthsManager.Object
            );

            // Act
            var result = (await petsManager.BatchCreatePetsAsync(petDtos)).ToList();

            // Assert
            Assert.Equal(2, result.Count);
            mockPetRepository.Verify(repo => repo.CreateAsync(It.IsAny<Pet>()), Times.Exactly(2));
            mockPetRepository.Verify(repo => repo.SaveChangesAsync(), Times.Exactly(2));
        }
    }
}