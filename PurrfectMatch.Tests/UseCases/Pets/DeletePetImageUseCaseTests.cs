using System;
using System.Threading.Tasks;
using Moq;
using PurrfectMatch.Application.Managers.Pets;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.Services;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Pets
{
    public class DeletePetImageUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ShouldDeletePetImage_WhenPhotoExistsAndBelongsToPet()
        {
            // Arrange
            var mockBlobStorageService = new Mock<IBlobStorageService>();
            var mockPetPhotoRepository = new Mock<IBaseRepository<PetPhoto>>();

            var petId = 1;
            var photoId = 101;
            var petPhoto = new PetPhoto { PhotoId = photoId, PetId = petId, PhotoUrl = "test-url" };

            mockPetPhotoRepository.Setup(repo => repo.GetAsync(photoId)).ReturnsAsync(petPhoto);
            mockBlobStorageService.Setup(service => service.DeleteImageAsync(petPhoto.PhotoUrl)).Returns(Task.CompletedTask);
            mockPetPhotoRepository.Setup(repo => repo.Delete(petPhoto));
            mockPetPhotoRepository.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            var petsManager = new PetsManager(
                Mock.Of<IBaseRepository<Pet>>(),
                mockPetPhotoRepository.Object,
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IHealthRecordRepository>(),
                mockBlobStorageService.Object,
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
            await petsManager.DeletePetImageAsync(petId, photoId);

            // Assert
            mockBlobStorageService.Verify(service => service.DeleteImageAsync(petPhoto.PhotoUrl), Times.Once);
            mockPetPhotoRepository.Verify(repo => repo.Delete(petPhoto), Times.Once);
            mockPetPhotoRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldThrowKeyNotFoundException_WhenPhotoDoesNotExist()
        {
            // Arrange
            var mockBlobStorageService = new Mock<IBlobStorageService>();
            var mockPetPhotoRepository = new Mock<IBaseRepository<PetPhoto>>();

            var petId = 1;
            var photoId = 101;

            mockPetPhotoRepository.Setup(repo => repo.GetAsync(photoId)).ReturnsAsync((PetPhoto?)null);

            var petsManager2 = new PetsManager(
                Mock.Of<IBaseRepository<Pet>>(),
                mockPetPhotoRepository.Object,
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IHealthRecordRepository>(),
                mockBlobStorageService.Object,
                Mock.Of<IBaseSoftDeleteRepository<Pet>>(),
                Mock.Of<AutoMapper.IMapper>(),
                new SpeciesManager(Mock.Of<IBaseRepository<Species>>(), Mock.Of<AutoMapper.IMapper>()),
                new BreedsManager(Mock.Of<IBaseRepository<Breed>>(), Mock.Of<AutoMapper.IMapper>()),
                new ActivityLevelsManager(Mock.Of<IBaseRepository<ActivityLevel>>(), Mock.Of<AutoMapper.IMapper>()),
                new HealthStatusesManager(Mock.Of<IBaseRepository<HealthStatus>>(), Mock.Of<AutoMapper.IMapper>()),
                new ColorsManager(Mock.Of<IBaseRepository<Color>>(), Mock.Of<AutoMapper.IMapper>()),
                new CoatLengthsManager(Mock.Of<IBaseRepository<CoatLength>>(), Mock.Of<AutoMapper.IMapper>())
            );

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => petsManager2.DeletePetImageAsync(petId, photoId));
        }

        [Fact]
        public async Task ExecuteAsync_ShouldThrowKeyNotFoundException_WhenPhotoDoesNotBelongToPet()
        {
            // Arrange
            var mockBlobStorageService = new Mock<IBlobStorageService>();
            var mockPetPhotoRepository = new Mock<IBaseRepository<PetPhoto>>();

            var petId = 1;
            var photoId = 101;
            var petPhoto = new PetPhoto { PhotoId = photoId, PetId = 2, PhotoUrl = "test-url" }; // Belongs to a different pet

            mockPetPhotoRepository.Setup(repo => repo.GetAsync(photoId)).ReturnsAsync(petPhoto);

            var petsManager3 = new PetsManager(
                Mock.Of<IBaseRepository<Pet>>(),
                mockPetPhotoRepository.Object,
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IHealthRecordRepository>(),
                mockBlobStorageService.Object,
                Mock.Of<IBaseSoftDeleteRepository<Pet>>(),
                Mock.Of<AutoMapper.IMapper>(),
                new SpeciesManager(Mock.Of<IBaseRepository<Species>>(), Mock.Of<AutoMapper.IMapper>()),
                new BreedsManager(Mock.Of<IBaseRepository<Breed>>(), Mock.Of<AutoMapper.IMapper>()),
                new ActivityLevelsManager(Mock.Of<IBaseRepository<ActivityLevel>>(), Mock.Of<AutoMapper.IMapper>()),
                new HealthStatusesManager(Mock.Of<IBaseRepository<HealthStatus>>(), Mock.Of<AutoMapper.IMapper>()),
                new ColorsManager(Mock.Of<IBaseRepository<Color>>(), Mock.Of<AutoMapper.IMapper>()),
                new CoatLengthsManager(Mock.Of<IBaseRepository<CoatLength>>(), Mock.Of<AutoMapper.IMapper>())
            );

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => petsManager3.DeletePetImageAsync(petId, photoId));
        }
    }
}