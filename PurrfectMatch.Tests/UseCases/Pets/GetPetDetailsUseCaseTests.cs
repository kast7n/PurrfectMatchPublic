using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Application.Managers.Pets;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Application.Specifications.Pets;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Pets;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Pets
{
    public class GetPetDetailsUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ShouldReturnPetDetails_WhenPetExists()
        {
            // Arrange
            var mockPetRepository = new Mock<IBaseRepository<Pet>>();
            var mockPetPhotoRepository = new Mock<IBaseRepository<PetPhoto>>();
            var mockMapper = new Mock<IMapper>();

            var petId = 1;
            var pet = new Pet { PetId = petId, Name = "Buddy" };
            var photos = new List<PetPhoto>
            {
                new PetPhoto { PhotoId = 101, PetId = petId, PhotoUrl = "url1" },
                new PetPhoto { PhotoId = 102, PetId = petId, PhotoUrl = "url2" }
            };
            var petDto = new PetDto { PetId = petId, Name = "Buddy", PhotoUrls = new List<string> { "url1", "url2" } };

            mockPetRepository.Setup(repo => repo.GetAsync(petId)).ReturnsAsync(pet);
            mockPetPhotoRepository.Setup(repo => repo.ListAsync(It.IsAny<PhotosByPetIdSpecification>()))
                                   .ReturnsAsync(photos);
            mockMapper.Setup(mapper => mapper.Map<PetDto>(pet)).Returns(petDto);

            var petsManager = new PetsManager(
                mockPetRepository.Object,
                mockPetPhotoRepository.Object,
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
            var result = await petsManager.GetPetDetailsAsync(petId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(petId, result.PetId);
            Assert.Equal("Buddy", result.Name);
            Assert.Equal(2, result.PhotoUrls.Count);
            Assert.Contains("url1", result.PhotoUrls);
            Assert.Contains("url2", result.PhotoUrls);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldThrowKeyNotFoundException_WhenPetDoesNotExist()
        {
            // Arrange
            var mockPetRepository = new Mock<IBaseRepository<Pet>>();
            var mockPetPhotoRepository = new Mock<IBaseRepository<PetPhoto>>();
            var mockMapper = new Mock<IMapper>();

            var petId = 1;

            mockPetRepository.Setup(repo => repo.GetAsync(petId)).ReturnsAsync((Pet?)null);

            var petsManager2 = new PetsManager(
                mockPetRepository.Object,
                mockPetPhotoRepository.Object,
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

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => petsManager2.GetPetDetailsAsync(petId));
        }
    }
}