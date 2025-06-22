using System.Threading.Tasks;
using Moq;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using AutoMapper;
using Xunit;
using PurrfectMatch.Application.Managers;

namespace PurrfectMatch.Tests.Managers.AdoptionApplications
{
    public class GetAdoptionApplicationByIdManagerTests
    {        [Fact]
        public async Task GetAdoptionApplicationByIdAsync_ReturnsAdoptionApplication_WhenIdExists()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<AdoptionApplication>>();
            var mockPetRepository = new Mock<IBaseRepository<Pet>>();
            var mockShelterManagerRepository = new Mock<IBaseRepository<ShelterManager>>();
            var mockMapper = new Mock<IMapper>();
            var adoptionApplication = new AdoptionApplication { ApplicationId = 1 };
            mockRepository.Setup(repo => repo.GetAsync(1)).ReturnsAsync(adoptionApplication);
            var manager = new AdoptionApplicationsManager(
                mockRepository.Object, 
                mockPetRepository.Object, 
                mockShelterManagerRepository.Object, 
                mockMapper.Object);

            // Act
            var result = await manager.GetAdoptionApplicationByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.ApplicationId);
        }        [Fact]
        public async Task GetAdoptionApplicationByIdAsync_ReturnsNull_WhenIdDoesNotExist()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<AdoptionApplication>>();
            var mockPetRepository = new Mock<IBaseRepository<Pet>>();
            var mockShelterManagerRepository = new Mock<IBaseRepository<ShelterManager>>();
            var mockMapper = new Mock<IMapper>();
            mockRepository.Setup(repo => repo.GetAsync(2)).ReturnsAsync((AdoptionApplication?)null);
            var manager = new AdoptionApplicationsManager(
                mockRepository.Object, 
                mockPetRepository.Object, 
                mockShelterManagerRepository.Object, 
                mockMapper.Object);

            // Act
            var result = await manager.GetAdoptionApplicationByIdAsync(2);

            // Assert
            Assert.Null(result);
        }
    }
}