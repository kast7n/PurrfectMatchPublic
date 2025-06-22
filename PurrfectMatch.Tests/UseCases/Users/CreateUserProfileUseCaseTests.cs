using System;
using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.Services;
using PurrfectMatch.Shared.DTOs.Users;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Users
{
    public class CreateUserProfileUseCaseTests
    {
        private readonly Mock<IUserProfileRepository> _mockUserProfileRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly UsersManager _usersManager;

        public CreateUserProfileUseCaseTests()
        {
            _mockUserProfileRepository = new Mock<IUserProfileRepository>();
            _mockUserProfileRepository.As<IBaseRepository<UserProfile>>();
            _mockMapper = new Mock<IMapper>();            _usersManager = new UsersManager(
                Mock.Of<IBaseRepository<Favorite>>(),
                Mock.Of<IBaseRepository<Pet>>(),
                _mockUserProfileRepository.Object,
                Mock.Of<IBlobStorageService>(),
                _mockMapper.Object
            );
        }

        [Fact]
        public async Task ExecuteAsync_ShouldCreateUserProfileSuccessfully()
        {
            // Arrange
            var userProfileDto = new UserProfileDto
            {
                userId = "user123",
                PhoneNumber = "123-456-7890",
                GeneralInfo = "Loves animals",
                HousingType = "Apartment",
                ExperienceWithPets = "5 years",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var userProfile = new UserProfile
            {
                UserId = "user123",
                PhoneNumber = "123-456-7890",
                GeneralInfo = "Loves animals",
                HousingType = "Apartment",
                ExperienceWithPets = "5 years",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _mockMapper.Setup(mapper => mapper.Map<UserProfile>(userProfileDto)).Returns(userProfile);
            _mockMapper.Setup(mapper => mapper.Map<UserProfileDto>(userProfile)).Returns(userProfileDto);
            _mockUserProfileRepository.As<IBaseRepository<UserProfile>>().Setup(repo => repo.CreateAsync(userProfile)).Returns(Task.CompletedTask);
            _mockUserProfileRepository.As<IBaseRepository<UserProfile>>().Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            // Act
            var result = await _usersManager.CreateUserProfileAsync(userProfileDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userProfileDto.userId, result.userId);
            Assert.Equal(userProfileDto.PhoneNumber, result.PhoneNumber);
            Assert.Equal(userProfileDto.GeneralInfo, result.GeneralInfo);
            Assert.Equal(userProfileDto.HousingType, result.HousingType);
            Assert.Equal(userProfileDto.ExperienceWithPets, result.ExperienceWithPets);

            _mockUserProfileRepository.As<IBaseRepository<UserProfile>>().Verify(repo => repo.CreateAsync(userProfile), Times.Once);
            _mockUserProfileRepository.As<IBaseRepository<UserProfile>>().Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }
    }
}