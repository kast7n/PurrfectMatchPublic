using Moq;
using Xunit;
using PurrfectMatch.Shared.DTOs.Users;
using System.Threading.Tasks;
using AutoMapper;
using PurrfectMatch.Domain.Interfaces.Services; // Add missing namespace for IMapper
using PurrfectMatch.Domain.Entities; // Add missing namespace for UserProfile
using DomainUserProfileRepository = PurrfectMatch.Domain.Interfaces.IRepositories.IUserProfileRepository;
using PurrfectMatch.Application.Managers;

namespace PurrfectMatch.Tests.UseCases.Users
{
    public class GetUserProfileByIdUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ShouldReturnUserProfile_WhenUserExists()
        {
            // Arrange
            var userId = "test-user-id";
            var mockUserProfileRepository = new Mock<DomainUserProfileRepository>();
            var expectedProfile = new UserProfile { UserId = userId, GeneralInfo = "Test User" };
            mockUserProfileRepository.Setup(repo => repo.GetUserProfileByUserId(It.IsAny<string>())).ReturnsAsync(expectedProfile);

            var mockMapper = new Mock<IMapper>();
            mockMapper.Setup(mapper => mapper.Map<UserProfileDto>(It.IsAny<UserProfile>()))
                      .Returns(new UserProfileDto { userId = userId, GeneralInfo = "Test User" });

            var usersManager = new UsersManager(Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Favorite>>(), Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Pet>>(), mockUserProfileRepository.Object, Mock.Of<IBlobStorageService>(), mockMapper.Object
            );

            // Act
            var result = await usersManager.GetUserProfileByIdAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test User", result.GeneralInfo);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            // Arrange
            var userId = "non-existent-user-id";
            var mockUserProfileRepository = new Mock<DomainUserProfileRepository>();
            mockUserProfileRepository.Setup(repo => repo.GetUserProfileByUserId(userId)).ReturnsAsync((UserProfile?)null);

            var mockMapper = new Mock<IMapper>();
            var usersManager = new UsersManager(Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Favorite>>(), Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Pet>>(), mockUserProfileRepository.Object, Mock.Of<IBlobStorageService>(), mockMapper.Object
            );

            // Act
            var result = await usersManager.GetUserProfileByIdAsync(userId);

            // Assert
            Assert.Null(result);
        }
    }
}