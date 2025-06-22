using Moq;
using Xunit;
using DomainUserProfileRepository = PurrfectMatch.Domain.Interfaces.IRepositories.IUserProfileRepository;
using PurrfectMatch.Shared.DTOs.Users;
using AutoMapper;
using System.Threading.Tasks;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Domain.Interfaces.Services;

namespace PurrfectMatch.Tests.UseCases.Users
{
    public class UpdateUserProfileUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ShouldUpdateUserProfile_WhenUserExists()
        {
            // Arrange
            var userId = "test-user-id";
            var mockUserProfileRepository = new Mock<DomainUserProfileRepository>();
            var mockMapper = new Mock<IMapper>();

            var existingProfile = new UserProfile { UserProfileId = 1, UserId = userId, GeneralInfo = "Old Info" };
            var updatedProfileDto = new UserProfileDto { GeneralInfo = "New Info" };

            mockUserProfileRepository.Setup(repo => repo.GetUserProfileByUserId(userId)).ReturnsAsync(existingProfile);
            mockUserProfileRepository.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);            mockMapper.Setup(mapper => mapper.Map<UserProfileDto>(existingProfile)).Returns(updatedProfileDto);

            var usersManager = new UsersManager(
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Favorite>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Pet>>(),
                mockUserProfileRepository.Object,
                Mock.Of<IBlobStorageService>(),
                mockMapper.Object
            );

            // Act
            var result = await usersManager.UpdateUserProfileAsync(userId, updatedProfileDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(updatedProfileDto.GeneralInfo, result.GeneralInfo);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            // Arrange
            var userId = "non-existent-user-id";
            var mockUserProfileRepository = new Mock<DomainUserProfileRepository>();
            var mockMapper = new Mock<IMapper>();            mockUserProfileRepository.Setup(repo => repo.GetUserProfileByUserId(userId)).ReturnsAsync((UserProfile?)null);

            var usersManager = new UsersManager(
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Favorite>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.Base.IBaseRepository<Pet>>(),
                mockUserProfileRepository.Object,
                Mock.Of<IBlobStorageService>(),
                mockMapper.Object
            );

            // Act
            var result = await usersManager.UpdateUserProfileAsync(userId, new UserProfileDto());

            // Assert
            Assert.Null(result);
        }
    }
}