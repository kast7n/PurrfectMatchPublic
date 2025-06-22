using System.Threading.Tasks;
using Moq;
using AutoMapper;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.AdoptionApplications
{
    public class UpdateAdoptionApplicationStatusManagerTests
    {
        private readonly Mock<IBaseRepository<AdoptionApplication>> _repositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly AdoptionApplicationsManager _manager;        public UpdateAdoptionApplicationStatusManagerTests()
        {
            _repositoryMock = new Mock<IBaseRepository<AdoptionApplication>>();
            _mapperMock = new Mock<IMapper>();
            var petRepositoryMock = new Mock<IBaseRepository<Pet>>();
            var shelterManagerRepositoryMock = new Mock<IBaseRepository<ShelterManager>>();
            _manager = new AdoptionApplicationsManager(
                _repositoryMock.Object, 
                petRepositoryMock.Object, 
                shelterManagerRepositoryMock.Object, 
                _mapperMock.Object);
        }

        [Fact]
        public async Task UpdateAdoptionApplicationStatusAsync_ShouldUpdateStatus_WhenApplicationExists()
        {
            // Arrange
            var applicationId = 1;
            var newStatus = "Approved";
            var application = new AdoptionApplication { ApplicationId = applicationId, Status = "Pending" };

            _repositoryMock.Setup(r => r.GetAsync(applicationId)).ReturnsAsync(application);
            _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            // Act
            var result = await _manager.UpdateAdoptionApplicationStatusAsync(applicationId, newStatus);

            // Assert
            Assert.True(result);
            Assert.Equal(newStatus, application.Status);
            _repositoryMock.Verify(r => r.Update(application), Times.Once);
            _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAdoptionApplicationStatusAsync_ShouldReturnFalse_WhenApplicationDoesNotExist()
        {
            // Arrange
            var applicationId = 1;
            var newStatus = "Approved";

            _repositoryMock.Setup(r => r.GetAsync(applicationId)).ReturnsAsync((AdoptionApplication?)null);

            // Act
            var result = await _manager.UpdateAdoptionApplicationStatusAsync(applicationId, newStatus);

            // Assert
            Assert.False(result);
            _repositoryMock.Verify(r => r.Update(It.IsAny<AdoptionApplication>()), Times.Never);
            _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Never);
        }
    }
}