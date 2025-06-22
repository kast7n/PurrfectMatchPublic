using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Domain.Interfaces.Services;
using Moq;
using AutoMapper;
using Xunit;
using System.Threading.Tasks;

namespace PurrfectMatch.Tests.UseCases.Users
{
    public class SoftDeleteUserProfileUseCaseTests
    {
        private readonly Mock<IUserProfileRepository> _repositoryMock;

        public SoftDeleteUserProfileUseCaseTests()
        {
            _repositoryMock = new Mock<IUserProfileRepository>();
        }        [Fact]
        public async Task ExecuteAsync_ShouldSoftDeleteUserProfile_WhenUserProfileExists()
        {
            // Arrange
            var userId = "test-user-id";
            var existingUserProfile = new UserProfile { UserId = userId };

            _repositoryMock.Setup(r => r.GetUserProfileByUserId(userId)).ReturnsAsync(existingUserProfile);
            _repositoryMock.Setup(r => r.Delete(existingUserProfile));
            _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var usersManager = new UsersManager(Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Favorite>>(), Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Pet>>(), _repositoryMock.Object, Mock.Of<IBlobStorageService>(), Mock.Of<AutoMapper.IMapper>()
            );

            // Act
            var result = await usersManager.SoftDeleteUserProfileAsync(userId);

            // Assert
            Assert.True(result);
            _repositoryMock.Verify(r => r.Delete(existingUserProfile), Times.Once);
            _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldReturnFalse_WhenUserProfileDoesNotExist()
        {
            // Arrange
            var userId = "non-existent-user-id";

            _repositoryMock.Setup(r => r.GetUserProfileByUserId(userId)).ReturnsAsync((UserProfile?)null);

            var usersManager = new UsersManager(Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Favorite>>(), Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Pet>>(), _repositoryMock.Object, Mock.Of<IBlobStorageService>(), Mock.Of<AutoMapper.IMapper>()
            );

            // Act
            var result = await usersManager.SoftDeleteUserProfileAsync(userId);            // Assert
            Assert.False(result);
            _repositoryMock.Verify(r => r.Delete(It.IsAny<UserProfile>()), Times.Never);
        }
    }
}