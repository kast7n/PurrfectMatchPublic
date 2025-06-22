using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Application.Managers.Pets;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using PurrfectMatch.Domain.Interfaces.Services;
using PurrfectMatch.Shared.DTOs.Pets;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Pets
{
    public class AddPetManagerTests
    {        [Fact]
        public async Task AddPetAsync_ShouldAddPetAndReturnPetId()
        {
            // Arrange
            var mockPetRepository = new Mock<IBaseRepository<Pet>>();
            var mockMapper = new Mock<IMapper>();
            var mockPetPhotoRepository = new Mock<IBaseRepository<PetPhoto>>();
            var mockHealthRecordRepository = new Mock<IHealthRecordRepository>();
            var mockBlobStorageService = new Mock<IBlobStorageService>();
            var mockSoftDeleteRepository = new Mock<IBaseSoftDeleteRepository<Pet>>();
            
            // Mock the attribute managers
            var mockSpeciesManager = new Mock<SpeciesManager>(Mock.Of<IBaseRepository<Species>>(), Mock.Of<IMapper>());
            var mockBreedsManager = new Mock<BreedsManager>(Mock.Of<IBaseRepository<Breed>>(), Mock.Of<IMapper>());
            var mockActivityLevelsManager = new Mock<ActivityLevelsManager>(Mock.Of<IBaseRepository<ActivityLevel>>(), Mock.Of<IMapper>());
            var mockHealthStatusesManager = new Mock<HealthStatusesManager>(Mock.Of<IBaseRepository<HealthStatus>>(), Mock.Of<IMapper>());
            var mockColorsManager = new Mock<ColorsManager>(Mock.Of<IBaseRepository<Color>>(), Mock.Of<IMapper>());
            var mockCoatLengthsManager = new Mock<CoatLengthsManager>(Mock.Of<IBaseRepository<CoatLength>>(), Mock.Of<IMapper>());

            var petDto = new CreatePetDto
            {
                Name = "Buddy",
                Age = "2",
                Gender = "Male",
                Size = "Medium",
                Description = "Friendly dog"
            };

            var pet = new Pet
            {
                PetId = 1,
                Name = "Buddy",
                Age = "2"
            };

            mockMapper.Setup(m => m.Map<Pet>(petDto)).Returns(pet);
            mockPetRepository.Setup(repo => repo.CreateAsync(pet)).Returns(Task.CompletedTask);
            mockPetRepository.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            var manager = new PetsManager(
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
            var result = await manager.AddPetAsync(petDto);

            // Assert
            Assert.Equal(1, result);
            mockPetRepository.Verify(repo => repo.CreateAsync(pet), Times.Once);
            mockPetRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }
    }
}