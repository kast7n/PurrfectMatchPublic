using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Domain.Interfaces.Services;
using AutoMapper;
using Moq;
using Xunit;
using System.Threading.Tasks;

namespace PurrfectMatch.Tests.UseCases.Users
{
    public class DeleteUserProfileUseCaseTests
    {
        private readonly Mock<IUserProfileRepository> _repositoryMock;

        public DeleteUserProfileUseCaseTests()
        {
            _repositoryMock = new Mock<IUserProfileRepository>();
        }

        [Fact]
        public async Task ExecuteAsync_ShouldDeleteUserProfile_WhenUserProfileExists()
        {
            // Arrange
            var userId = "existing-user";
            var userProfile = new UserProfile { UserId = userId };

            _repositoryMock.Setup(r => r.GetUserProfileByUserId(userId)).ReturnsAsync(userProfile);
            _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);            var usersManager = new UsersManager(
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Favorite>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Pet>>(),
                _repositoryMock.Object,
                Mock.Of<IBlobStorageService>(),
                Mock.Of<IMapper>()
            );

            // Act
            await usersManager.DeleteUserProfileAsync(userId);

            // Assert
            _repositoryMock.Verify(r => r.GetUserProfileByUserId(userId), Times.Once);
            _repositoryMock.Verify(r => r.Delete(userProfile), Times.Once);
            _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
    }
}