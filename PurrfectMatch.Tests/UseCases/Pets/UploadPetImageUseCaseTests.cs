using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Moq;
using PurrfectMatch.Application.Managers.Pets;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.Services;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Pets
{
    public class UploadPetImageUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ShouldUploadImageAndReturnUrl_WhenFileIsValid()
        {
            // Arrange
            var mockBlobStorageService = new Mock<IBlobStorageService>();
            var mockPetPhotoRepository = new Mock<IBaseRepository<PetPhoto>>();

            var petId = 1;
            var fileName = "test.jpg";
            var fileUrl = "https://example.com/test.jpg";
            var fileMock = new Mock<IFormFile>();

            fileMock.Setup(f => f.FileName).Returns(fileName);
            fileMock.Setup(f => f.Length).Returns(1024);
            fileMock.Setup(f => f.OpenReadStream()).Returns(new MemoryStream());

            mockBlobStorageService.Setup(service => service.UploadImageAsync(It.IsAny<string>(), It.IsAny<Stream>()))
                                   .ReturnsAsync(fileUrl);
            mockPetPhotoRepository.Setup(repo => repo.CreateAsync(It.IsAny<PetPhoto>())).Returns(Task.CompletedTask);
            mockPetPhotoRepository.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            var petsManager = new PetsManager(
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Pet>>(),
                mockPetPhotoRepository.Object,
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IHealthRecordRepository>(),
                mockBlobStorageService.Object,
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseSoftDeleteRepository<Pet>>(),
                Mock.Of<AutoMapper.IMapper>(),
                new SpeciesManager(Mock.Of<IBaseRepository<Species>>(), Mock.Of<AutoMapper.IMapper>()),
                new BreedsManager(Mock.Of<IBaseRepository<Breed>>(), Mock.Of<AutoMapper.IMapper>()),
                new ActivityLevelsManager(Mock.Of<IBaseRepository<ActivityLevel>>(), Mock.Of<AutoMapper.IMapper>()),
                new HealthStatusesManager(Mock.Of<IBaseRepository<HealthStatus>>(), Mock.Of<AutoMapper.IMapper>()),
                new ColorsManager(Mock.Of<IBaseRepository<Color>>(), Mock.Of<AutoMapper.IMapper>()),
                new CoatLengthsManager(Mock.Of<IBaseRepository<CoatLength>>(), Mock.Of<AutoMapper.IMapper>())
            );

            // Act
            var result = await petsManager.UploadPetImageAsync(petId, fileMock.Object);

            // Assert
            Assert.Equal(fileUrl, result);
            mockBlobStorageService.Verify(service => service.UploadImageAsync(It.IsAny<string>(), It.IsAny<Stream>()), Times.Once);
            mockPetPhotoRepository.Verify(repo => repo.CreateAsync(It.IsAny<PetPhoto>()), Times.Once);
            mockPetPhotoRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldThrowArgumentException_WhenFileIsEmpty()
        {
            // Arrange
            var mockBlobStorageService = new Mock<IBlobStorageService>();
            var mockPetPhotoRepository = new Mock<IBaseRepository<PetPhoto>>();

            var petId = 1;
            var fileMock = new Mock<IFormFile>();

            fileMock.Setup(f => f.Length).Returns(0);

            var petsManager2 = new PetsManager(
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Pet>>(),
                mockPetPhotoRepository.Object,
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IHealthRecordRepository>(),
                mockBlobStorageService.Object,
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseSoftDeleteRepository<Pet>>(),
                Mock.Of<AutoMapper.IMapper>(),
                new SpeciesManager(Mock.Of<IBaseRepository<Species>>(), Mock.Of<AutoMapper.IMapper>()),
                new BreedsManager(Mock.Of<IBaseRepository<Breed>>(), Mock.Of<AutoMapper.IMapper>()),
                new ActivityLevelsManager(Mock.Of<IBaseRepository<ActivityLevel>>(), Mock.Of<AutoMapper.IMapper>()),
                new HealthStatusesManager(Mock.Of<IBaseRepository<HealthStatus>>(), Mock.Of<AutoMapper.IMapper>()),
                new ColorsManager(Mock.Of<IBaseRepository<Color>>(), Mock.Of<AutoMapper.IMapper>()),
                new CoatLengthsManager(Mock.Of<IBaseRepository<CoatLength>>(), Mock.Of<AutoMapper.IMapper>())
            );

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => petsManager2.UploadPetImageAsync(petId, fileMock.Object));
        }
    }
}