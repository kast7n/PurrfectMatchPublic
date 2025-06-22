using System.Threading.Tasks;
using Moq;
using AutoMapper;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.AdoptionApplications
{
    public class SoftDeleteAdoptionApplicationManagerTests
    {
        private readonly Mock<IBaseSoftDeleteRepository<AdoptionApplication>> _repositoryMock;
        private readonly Mock<IBaseRepository<AdoptionApplication>> _baseRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly AdoptionApplicationsManager _manager;        public SoftDeleteAdoptionApplicationManagerTests()
        {
            _repositoryMock = new Mock<IBaseSoftDeleteRepository<AdoptionApplication>>();
            _baseRepositoryMock = new Mock<IBaseRepository<AdoptionApplication>>();
            _mapperMock = new Mock<IMapper>();
            var petRepositoryMock = new Mock<IBaseRepository<Pet>>();
            var shelterManagerRepositoryMock = new Mock<IBaseRepository<ShelterManager>>();
            _manager = new AdoptionApplicationsManager(
                _baseRepositoryMock.Object, 
                petRepositoryMock.Object, 
                shelterManagerRepositoryMock.Object, 
                _mapperMock.Object, 
                null, 
                _repositoryMock.Object);
        }

        [Fact]
        public async Task SoftDeleteAdoptionApplicationAsync_CallsDeleteOnRepository_WhenApplicationExists()
        {
            // Arrange
            int applicationId = 1;
            var adoptionApplication = new AdoptionApplication { ApplicationId = applicationId };

            _repositoryMock.Setup(r => r.GetAsync(applicationId)).ReturnsAsync(adoptionApplication);

            // Act
            var result = await _manager.SoftDeleteAdoptionApplicationAsync(applicationId);

            // Assert
            Assert.True(result);
            _repositoryMock.Verify(r => r.GetAsync(applicationId), Times.Once);
            _repositoryMock.Verify(r => r.Delete(adoptionApplication), Times.Once);
            _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task SoftDeleteAdoptionApplicationAsync_DoesNotCallDelete_WhenApplicationDoesNotExist()
        {
            // Arrange
            int applicationId = 1;

            _repositoryMock.Setup(r => r.GetAsync(applicationId)).ReturnsAsync((AdoptionApplication?)null);

            // Act
            var result = await _manager.SoftDeleteAdoptionApplicationAsync(applicationId);

            // Assert
            Assert.False(result);
            _repositoryMock.Verify(r => r.Delete(It.IsAny<AdoptionApplication>()), Times.Never);
            _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }
    }
}